
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import Producto from '../models/product.model.js';
import Imagen_producto from '../models/product_images.model.js';
import Producto_sucursal from '../models/store_products.model.js'
import Verificacion from '../models/verification.model.js';
import Captura from '../models/capture.model.js';
import Usuario from '../models/user.model.js';
import Orden from '../models/order.model.js';

export const getProducts = async (req, res) => {
    try {
        const productos = await Producto.findAll();

        const ImagenProducto = await Promise.all(productos.map(async (producto) => {
            const imagenes = await Imagen_producto.findAll({ where: { id_producto: producto.id } });
            return {
                ...producto.toJSON(),
                imagen: imagenes.map(imagen => imagen.imagen),
                imagenS: imagenes.map(imagen => imagen.qr)
            };
        }));

        res.json(ImagenProducto);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener los productos de la base de datos.'
        });
    }
};

export const getProduct = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }

    try {
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).send({
                error: 'Producto no encontrado.'
            });
        }

        const imagenes = await Imagen_producto.findAll({ where: { id_producto: producto.id } });

        const productoConImagenes = {
            ...producto.toJSON(),
            imagenes: imagenes.map(imagen => ({
                id: imagen.id,
                imagen: imagen.imagen,
                qr: imagen.qr
            }))
        };

        res.json(productoConImagenes);

    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener el producto de la base de datos.'
        });
    }
};

export const postProduct = async (req, res) => {
    const { nombre, precio, genero, tipo } = req.body;
    const productImage = req.file ? req.file.path : null;

    console.log('Received file:', req.file);

    if (!nombre || !precio || !genero || !tipo) {
        return res.status(400).send({ error: 'Faltan campos en el cuerpo de la petición.' });
    }

    try {
        const newProduct = await Producto.create({
            nombre,
            precio,
            genero,
            tipo,
        });

        // Renombrar el archivo con el id y el nombre del producto
        const firstWord = nombre.split(' ')[0];
        const finalWord = firstWord.normalize('NFD').replace(/[\u0300-\u036f]/g, '')// Elimina caracteres especiales

        const newFileName = `${newProduct.id}-${finalWord}-product${path.extname(productImage)}`;
        const newFilePath = path.join('images/', newFileName);

        if (productImage) {
            fs.renameSync(productImage, newFilePath);
        }

        const productData = {
            id: newProduct.id,
            nombre,
            precio,
            genero,
            tipo,
            imagen: productImage,
        };

        const jsonString = JSON.stringify(productData);

        const qrCodeData = await QRCode.toDataURL(jsonString);
        const qrFileName = `${newProduct.id}-${finalWord}-qr.png`;
        const qrImagePath = path.join('images/qrs/', qrFileName);
        const base64Data = qrCodeData.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync(qrImagePath, base64Data, 'base64');

        await Imagen_producto.create({
            id_producto: newProduct.id,
            imagen: newFilePath,
            qr: qrImagePath,
        });

        res.status(201).send(productData);
    } catch (error) {
        console.error('Error al insertar el producto:', error);
        res.status(500).send({ error: 'Ocurrió un error al insertar el producto en la base de datos.' });
    }
};

export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { nombre, precio, genero, tipo } = req.body;
    const image = req.file ? req.file.path : null;

    if (!id || isNaN(id)) {
        return res.status(400).send({ error: 'ID inválido' });
    }

    try {
        const product = await Producto.findByPk(id);

        if (!product) {
            return res.status(404).send({ error: 'Producto no encontrado.' });
        }

        const productData = {
            id: product.id,
            nombre: nombre || product.nombre,
            precio: precio || product.precio,
            genero: genero || product.genero,
            tipo: tipo || product.tipo,
            imagen: image || product.imagen,
        };

        const jsonString = JSON.stringify(productData);
        const qrCodeData = await QRCode.toDataURL(jsonString);
        const qrFileName = `${product.id}-${product.nombre}-qr.png`;
        const qrImagePath = path.join('images/qrs/', qrFileName);
        const base64Data = qrCodeData.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync(qrImagePath, base64Data, 'base64');

        await product.update({
            nombre: nombre || product.nombre,
            precio: precio || product.precio,
            genero: genero || product.genero,
            tipo: tipo || product.tipo,
        });

        if (image) {
            const imageRecord = await Imagen_producto.findOne({ where: { id_producto: product.id } });

            if (imageRecord) {
                if (fs.existsSync(imageRecord.imagen)) {
                    fs.unlinkSync(imageRecord.imagen);
                }

                await imageRecord.update({
                    imagen: image,
                });
            } else {
                await Imagen_producto.create({
                    id_producto: product.id,
                    imagen: image,
                });
            }
        }

        res.json(productData);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send({ error: 'Ocurrió un error al actualizar el producto en la base de datos.' });
    }
};

export const deleteProduct = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }


    try {
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).send({
                error: 'Producto no encontrado.'
            });
        }

        const imagenes = await Imagen_producto.findAll({ where: { id_producto: producto.id } });

        await Producto.destroy({ where: { id } });

        // Aqui se eliminan las imágenes del servidor
        await Promise.all(imagenes.map(async (imagen) => {
            try {
                const imagenPath = imagen.imagen; 
                const qrPath = imagen.qr; 

                if (imagenPath) {
                    await fs.promises.unlink(imagenPath);
                }
                if (qrPath) {
                    await fs.promises.unlink(qrPath);
                }

                await Imagen_producto.destroy({ where: { id: imagen.id } });

            } catch (error) {
                console.error(`Error al eliminar imagen (${imagen.id}):`, error);
            }
        }));

        res.sendStatus(204);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).send({
            error: 'Ocurrió un error al eliminar el producto de la base de datos.'
        });
    }
};

//SUCURSALES
export const getProductsByStore = async (req, res) => {
    const id_sucursal = req.params.id;

    if (!id_sucursal || isNaN(id_sucursal)) {
        return res.status(400).send({
            error: 'ID de sucursal inválido'
        });
    }

    try {
        const productosSucursal = await Producto_sucursal.findAll({
            where: { id_sucursal },
            include: [{
                model: Producto,
                include: [{
                    model: Imagen_producto,
                    attributes: ['imagen']
                }]
            }]
        });

        const productos = productosSucursal.map(productoSucursal => {
            const producto = productoSucursal.Producto;
            const imagenProducto = producto.Imagen_producto;
            return {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                genero: producto.genero,
                tipo: producto.tipo,
                cantidad: productoSucursal.cantidad,
                imagenS: productoSucursal.imagen,
                imagen: imagenProducto ? imagenProducto.imagen : null
            };
        });

        res.json(productos);
    } catch (error) {
        console.error('Error al obtener los productos de la sucursal:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener los productos de la sucursal de la base de datos.'
        });
    }
};

export const addProductToStore = async (req, res) => {
    const { id_producto, id_sucursal, cantidad } = req.body;
    const productImage = req.file ? req.file.path : null;

    if (!id_producto || !id_sucursal || !cantidad) {
        return res.status(400).send({ error: 'Faltan campos en el cuerpo de la petición.' });
    }

    try {
        const newProductStore = await Producto_sucursal.create({
            id_producto,
            id_sucursal,
            cantidad,
        });

        // Si hay una imagen actualiza el registro
        if (productImage) {
            const idProduct = id_producto.toString();
            const newFileName = `${idProduct}-${id_sucursal}-store-product${path.extname(productImage)}`;
            const newFilePath = path.join('images/', newFileName);

            // Renombrar el archivo con el nuevo nombre
            fs.renameSync(productImage, newFilePath);

            // Actualizar el registro con la ruta del nuevo archivo
            await Producto_sucursal.update(
                { imagen: newFilePath },
                { where: { id: newProductStore.id } }
            );
        }

        const responseData = {
            id_producto: newProductStore.id_producto,
            id_sucursal: newProductStore.id_sucursal,
            cantidad: newProductStore.cantidad,
            imagen: productImage ? path.join('images/', path.basename(productImage)) : null,
        };

        res.status(201).send(responseData);
    } catch (error) {
        console.error('Error al añadir producto a la sucursal:', error);
        res.status(500).send({ error: 'Ocurrió un error al insertar el producto en la sucursal en la base de datos.' });
    }
};

//Esto no se usa
export const updateProductInStore = async (req, res) => {
    const { id_producto, id_sucursal } = req.params;
    const { cantidad } = req.body;

    if (!id_producto || !id_sucursal || !cantidad) {
        return res.status(400).send({ error: 'Faltan campos en el cuerpo de la petición.' });
    }

    try {
        const productStore = await Producto_sucursal.findOne({
            where: {
                id_producto,
                id_sucursal
            }
        });

        if (!productStore) {
            return res.status(404).send({ error: 'Producto no encontrado en la sucursal.' });
        }

        productStore.cantidad = cantidad;
        await productStore.save();

        res.status(200).send(productStore);
    } catch (error) {
        console.error('Error al actualizar el producto en la sucursal:', error);
        res.status(500).send({ error: 'Ocurrió un error al actualizar el producto en la sucursal en la base de datos.' });
    }
};

//Para modificar varios productos a la vez
export const updateProductsInStore = async (req, res) => {
    const { id_sucursal } = req.params;
    const { products } = req.body;

    if (!id_sucursal || !Array.isArray(products) || products.length === 0) {
        return res.status(400).send({ error: 'Faltan campos en el cuerpo de la petición o el formato es incorrecto.' });
    }

    try {
        const updateResults = [];
        const errors = [];

        for (const product of products) {
            const { id_producto, cantidad } = product;

            if (!id_producto || cantidad === undefined) {
                errors.push({ id_producto, error: 'Faltan campos en el objeto del producto.' });
                continue;
            }

            try {
                const productStore = await Producto_sucursal.findOne({
                    where: {
                        id_producto,
                        id_sucursal
                    }
                });

                if (!productStore) {
                    errors.push({ id_producto, error: 'Producto no encontrado en la sucursal.' });
                    continue;
                }

                productStore.cantidad = cantidad;
                await productStore.save();

                updateResults.push({ id_producto, cantidad });
            } catch (error) {
                console.error(`Error al actualizar el producto ${id_producto}:`, error);
                errors.push({ id_producto, error: 'Error al actualizar el producto en la base de datos.' });
            }
        }

        res.status(200).send({
            updated: updateResults,
            errors
        });
    } catch (error) {
        console.error('Error al actualizar los productos en la sucursal:', error);
        res.status(500).send({ error: 'Ocurrió un error al actualizar los productos en la sucursal en la base de datos.' });
    }
};

export const removeProductFromStore = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID de sucursal_producto inválido'
        });
    }

    try {
        const result = await SucursalProducto.findOne({
            where: { id }
        });

        if (!result) {
            return res.status(404).send({
                error: 'Producto de sucursal no encontrado.'
            });
        }

        await result.destroy();
        res.sendStatus(204); 
    } catch (error) {
        console.error('Error al eliminar el producto de la sucursal:', error);
        res.status(500).send({
            error: 'Ocurrió un error al eliminar el producto de la sucursal de la base de datos.'
        });
    }
};

//PROCESOS
export const verificate = async (req, res) => {
    const { id_usuario, id_orden, id_sucursal, fecha } = req.body;

    try {
        const newVerificacion = await Verificacion.create({
            id_usuario,
            id_orden,
            id_sucursal,
            fecha
        });

        res.status(201).json(newVerificacion);
    } catch (error) {
        console.error('Error al crear la verificación:', error);
        res.status(500).json({ message: error.message });
    }
};

export const capture = async (req, res) => {
    const { captures } = req.body;

    if (!Array.isArray(captures) || captures.length === 0) {
        return res.status(400).json({ message: 'El cuerpo de la solicitud debe contener un array de capturas.' });
    }

    try {
        const newCaptures = await Captura.bulkCreate(captures);

        res.status(201).json(newCaptures);
    } catch (error) {
        console.error('Error al crear las capturas:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getVerificationsByStore = async (req, res) => {
    const { id_sucursal } = req.params;

    try {
        const verifications = await Verificacion.findAll({
            where: {
                id_sucursal
            },
            include: [
                {
                    model: Usuario,
                },
                {
                    model: Orden,
                }
            ]
        });

        if (verifications.length === 0) {
            return res.status(404).json({ message: 'No se encontraron verificaciones para la sucursal dada.' });
        }

        const formattedVerificaciones = verifications.map(verification => ({
            id: verification.id,
            Usuario: verification.Usuario,
            Orden: verification.Orden,
            fecha: new Date(verification.fecha).toLocaleDateString('es-ES')
        }));

        res.json(formattedVerificaciones);
    } catch (error) {
        console.error('Error al obtener las verificaciones:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getCapturesByStore = async (req, res) => {
    const { id_sucursal } = req.params;

    try {
        const captures = await Captura.findAll({
            where: {
                id_sucursal
            },
            include: [
                {
                    model: Usuario
                },
                {
                    model: Producto
                }
            ]
        });

        if (captures.length === 0) {
            return res.status(404).json({ message: 'No se encontraron capturas para la sucursal dada.' });
        }

        const formattedCapturas = captures.map(capture => ({
            id: capture.id,
            Usuario: capture.Usuario,
            Producto: capture.Producto,
            fecha: new Date(capture.fecha).toLocaleDateString('es-ES')
        }));

        res.json(formattedCapturas);
    } catch (error) {
        console.error('Error al obtener las capturas:', error);
        res.status(500).json({ message: error.message });
    }
};
