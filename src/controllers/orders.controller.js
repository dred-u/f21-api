import Orden from '../models/order.model.js';
import Detalles_orden from '../models/order_details.model.js';
import Producto from '../models/product.model.js';
import Imagen_producto from '../models/product_images.model.js';
import Sucursal from '../models/store.model.js';

export const getOrders = async (req, res) => {
    try {
        const orders = await Orden.findAll({
            include: [{
                model: Sucursal,
                attributes: ['nombre']
            }]
        });

        const formattedOrders = orders.map(order => ({
            id: order.id,
            descripcion: order.descripcion,
            fecha: new Date(order.fecha).toLocaleDateString('es-ES'),
            status: order.status,
            sucursal: order.Sucursal.nombre
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error al obtener las ordenes:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener las ordenes de la base de datos.'
        });
    }
};

export const getOrder = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }

    try {
        const order = await Orden.findByPk(id);

        if (!order) {
            return res.status(404).send({
                error: 'Orden no encontrada.'
            });
        }
        res.json(order);

    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener la orden de la base de datos.'
        });
    }
};

export const getStoreOrders = async (req, res) => {
    const id_sucursal = req.params.id;

    if (!id_sucursal || isNaN(id_sucursal)) {
        return res.status(400).send({
            error: 'ID de sucursal inválido'
        });
    }

    try {
        const orders = await Orden.findAll({
            where: { id_sucursal: id_sucursal },
            include: [{
                model: Sucursal,
                attributes: ['nombre']
            }]
        });

        // Aqui formateo la fecha de cada orden
        const formattedOrders = orders.map(order => ({
            id: order.id,
            descripcion: order.descripcion,
            fecha: new Date(order.fecha).toLocaleDateString('es-ES'),
            status: order.status,
            sucursal: order.Sucursal.nombre
        }));

        res.json(formattedOrders);

    } catch (error) {
        console.error('Error al obtener las ordenes:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener las ordenes de la base de datos.'
        });
    }
};

export const postOrder = async (req, res) => {
    const { id_sucursal, fecha, descripcion, status } = req.body;

    if (!id_sucursal || !fecha || !descripcion || !status) {
        return res.status(400).send({ error: 'Faltan campos en el cuerpo de la petición.' });
    }

    try {
        const newOrder = await Orden.create({ id_sucursal, fecha, descripcion, status });
        res.status(201).send(newOrder);
    } catch (error) {
        console.error('Error al generar la orden:', error);
        res.status(500).send({ error: 'Ocurrió un error al insertar la orden en la base de datos.' });
    }
};

export const updateOrder = async (req, res) => {
    const id = req.params.id;
    const { id_sucursal, fecha, descripcion, status } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }

    try {
        const order = await Orden.findByPk(id);

        if (!order) {
            return res.status(404).send({ error: 'Orden no encontrada.' });
        }

        await order.update({ id_sucursal, fecha, descripcion, status });
        res.json(order);
    } catch (error) {
        console.error('Error al actualizar la orden:', error);
        res.status(500).send({
            error: 'Ocurrió un error al actualizar la orden en la base de datos.'
        });
    }
};

export const deleteOrder = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }

    try {
        const order = await Orden.findByPk(id);

        if (!order) {
            return res.status(404).send({ error: 'Orden no encontrada.' });
        }

        await order.destroy();
        res.sendStatus(204);
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        res.status(500).send({
            error: 'Ocurrió un error al eliminar la orden de la base de datos.'
        });
    }
};


//DETALLES
export const getOrderDetails = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }

    try {
        const orderDetails = await Detalles_orden.findAll({
            where: { id_orden: id },
            include: [{
                model: Producto,
                attributes: ['id', 'nombre', 'precio'],
                include: [
                    {
                    model: Imagen_producto,
                    attributes: ['imagen']
                    }
                ]
            }]
        });

        if (!orderDetails.length) {
            return res.status(404).send({
                error: 'Detalle de orden no encontrado.'
            });
        }

        const formattedOrderDetails = orderDetails.map(detail => ({
            id: detail.id,
            id_orden: detail.id_orden,
            id_producto: detail.id_producto,
            cantidad: detail.cantidad,
            Producto: {
                id: detail.Producto.id,
                nombre: detail.Producto.nombre,
                precio: detail.Producto.precio,
                imagen: detail.Producto.Imagen_producto.imagen // Asumiendo que solo hay una imagen por producto
            }
        }));

        res.json(formattedOrderDetails);

    } catch (error) {
        console.error('Error al obtener el detalle de la orden:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener el detalle de la orden de la base de datos.'
        });
    }
};

export const postOrderDetails = async (req, res) => {
    const orders = Array.isArray(req.body) ? req.body : [req.body];

    try {
        const promises = orders.map(async (order) => {
            const { id_orden, id_producto, cantidad } = order;

            if (!id_orden || !id_producto || !cantidad) {
                throw new Error('Faltan campos en el cuerpo de la petición.');
            }

            await Detalles_orden.create({ id_orden, id_producto, cantidad });
        });

        await Promise.all(promises);

        res.status(201).send({ message: 'Detalles de la orden agregados exitosamente.' });
    } catch (error) {
        console.error('Error al generar detalles de la orden:', error);
        res.status(500).send({ error: 'Ocurrió un error al insertar los detalles de la orden en la base de datos.' });
    }
};

export const updateOrderDetails = async (req, res) => {
    const id = req.params.id;
    const { id_orden, id_producto, cantidad } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }

    if (!id_orden || !id_producto || !cantidad) {
        return res.status(400).send({ error: 'Faltan campos en el cuerpo de la petición.' });
    }

    try {
        const orderDetail = await Detalles_orden.findByPk(id);

        if (!orderDetail) {
            return res.status(404).send({
                error: 'Detalle de orden no encontrado.'
            });
        }

        await orderDetail.update({ id_orden, id_producto, cantidad });
        res.json(orderDetail);
    } catch (error) {
        console.error('Error al actualizar el detalle de la orden:', error);
        res.status(500).send({
            error: 'Ocurrió un error al actualizar el detalle de la orden en la base de datos.'
        });
    }
};
