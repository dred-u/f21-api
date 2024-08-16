import Sucursal from '../models/store.model.js';
import Usuario from '../models/user.model.js';
import Usuario_sucursal from '../models/store_users.model.js';

export const getStores = async (req, res) => {
    try {
        const sucursales = await Sucursal.findAll();
        res.json(sucursales);
    } catch (error) {
        console.error('Error al obtener las sucursales:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener las sucursales de la base de datos.'
        });
    }
};

export const getStore = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }

    try {
        const sucursal = await Sucursal.findByPk(id);

        if (!sucursal) {
            return res.status(404).send({
                error: 'Sucursal no encontrada.'
            });
        }
        res.json(sucursal);
    } catch (error) {
        console.error('Error al obtener la sucursal:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener la sucursal de la base de datos.'
        });
    }
};

export const postStore = async (req, res) => {
    const { nombre, telefono, direccion } = req.body;

    if (!nombre) {
        return res.status(400).send({ error: 'Faltan campos en el cuerpo de la petición.' });
    }

    try {
        const newSucursal = await Sucursal.create({ nombre, telefono, direccion });
        res.status(201).send(newSucursal);
    } catch (error) {
        console.error('Error al generar la sucursal:', error);
        res.status(500).send({ error: 'Ocurrió un error al insertar la sucursal en la base de datos.' });
    }
};

export const updateStore = async (req, res) => {
    const id = req.params.id;
    const { nombre, telefono, direccion } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }

    try {
        const sucursal = await Sucursal.findByPk(id);

        if (!sucursal) {
            return res.status(404).send({ error: 'Sucursal no encontrada.' });
        }

        await sucursal.update({ nombre, telefono, direccion });
        res.json(sucursal);
    } catch (error) {
        console.error('Error al actualizar la sucursal:', error);
        res.status(500).send({
            error: 'Ocurrió un error al actualizar la sucursal en la base de datos.'
        });
    }
};

export const deleteStore = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID inválido'
        });
    }

    try {
        const sucursal = await Sucursal.findByPk(id);

        if (!sucursal) {
            return res.status(404).send({ error: 'Sucursal no encontrada.' });
        }

        await sucursal.destroy();
        res.sendStatus(204);
    } catch (error) {
        console.error('Error al eliminar la sucursal:', error);
        res.status(500).send({
            error: 'Ocurrió un error al eliminar la sucursal de la base de datos.'
        });
    }
};


//SUCURSALES
export const getUsersByStore = async (req, res) => {
    const id_sucursal = req.params.id;

    if (!id_sucursal || isNaN(id_sucursal)) {
        return res.status(400).send({
            error: 'ID de sucursal inválido'
        });
    }

    try {
        const users = await Usuario_sucursal.findAll({
            where: { id_sucursal },
            include: [{ model: Usuario }] // Esto sirve para popular la informacion del usuario
        });

        res.json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios de la sucursal:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener los usuarios de la sucursal de la base de datos.'
        });
    }
};

export const getUserByStore = async (req, res) => {
    const id_usuario = req.params.id;

    if (!id_usuario || isNaN(id_usuario)) {
        return res.status(400).send({
            error: 'ID de usuario inválido'
        });
    }

    try {
        const user = await Usuario_sucursal.findOne({ 
            where: { id_usuario },
            include: [{ 
                model: Sucursal,
                attributes: ['id', 'nombre', 'telefono', 'direccion']
            }]
        });

        if (!user) {
            return res.status(404).send({
                error: 'Usuario no encontrado en la sucursal.'
            });
        }

        res.json(user);
    } catch (error) {
        console.error('Error al obtener el usuario en la sucursal:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener el usuario de la sucursal en la base de datos.'
        });
    }
};

export const addUserToStore = async (req, res) => {
    const { id_usuario, id_sucursal, puesto } = req.body;

    if (!id_usuario || !id_sucursal) {
        return res.status(400).send({ error: 'Faltan campos en el cuerpo de la petición.' });
    }

    try {
        const newUserStore = await Usuario_sucursal.create({
            id_usuario,
            id_sucursal,
            puesto: puesto || null
        });

        res.status(201).send({
            id: newUserStore.id,
            id_usuario,
            id_sucursal,
            puesto: newUserStore.puesto
        });

    } catch (error) {
        console.error('Error al añadir usuario a la sucursal:', error);
        res.status(500).send({ error: 'Ocurrió un error al insertar el usuario en la sucursal en la base de datos.' });
    }
};

export const removeUserFromStore = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).send({
            error: 'ID de usuario_sucursal inválido'
        });
    }

    try {
        const result = await Usuario_sucursal.destroy({
            where: { id }
        });

        if (!result) {
            return res.status(404).send({
                error: 'Usuario de sucursal no encontrado.'
            });
        }

        res.sendStatus(204);

    } catch (error) {
        console.error('Error al eliminar el usuario de la sucursal:', error);
        res.status(500).send({
            error: 'Ocurrió un error al eliminar el usuario de la sucursal de la base de datos.'
        });
    }
};
