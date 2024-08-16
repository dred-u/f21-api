import {SECRET_KEY} from '../config.js'
import createAccessToken from '../token.js'
import bcrypt from 'bcryptjs';
import jtkn from 'jsonwebtoken';
import Usuario from '../models/user.model.js';

export const getUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'apellido_paterno', 'apellido_materno', 'email', 'rol']
        });

        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).send({
            error: 'Ocurrió un error al obtener los usuarios de la base de datos.'
        });
    }
};

export const register = async (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, email, password, rol } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await Usuario.create({
            nombre,
            apellido_paterno,
            apellido_materno,
            email,
            password: passwordHash,
            rol
        });

        const token = await createAccessToken({ id: newUser.id });

        res.json({
            token, 
            user: {
            id: newUser.id,
            nombre,
            apellido_paterno,
            apellido_materno,
            email,
            rol
        }
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Hubo un problema al iniciar sesion, intenta mas tarde.' });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundUser = await Usuario.findOne({ where: { email } });

        if (!foundUser) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            console.log(foundUser)
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = await createAccessToken({ id: foundUser.id });

        res.json({
            token, 
            user: {
                id: foundUser.id,
                nombre: foundUser.nombre,
                apellido_paterno: foundUser.apellido_paterno,
                apellido_materno: foundUser.apellido_materno,
                email: foundUser.email,
                rol: foundUser.rol
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema con el servidor, intenta mas tarde.'});
    }
};

export const verifyToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json(['No autorizado']);
    }

    jtkn.verify(token, SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(401).json(['No autorizado']);
        }

        try {
            const userFound = await Usuario.findByPk(user.id);

            if (!userFound) {
                return res.status(401).json(['No se encontró el usuario']);
            }

            return res.json({
                user:{
                id: userFound.id,
                nombre: userFound.nombre,
                apellido_paterno: userFound.apellido_paterno,
                apellido_materno: userFound.apellido_materno,
                email: userFound.email,
                rol: userFound.rol,
            }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al verificar token, intenta mas tarde.' });
        }
    });
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno, email, password, rol } = req.body;

    try {
        const user = await Usuario.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            user.password = passwordHash;
        }

        user.nombre = nombre || user.nombre;
        user.apellido_paterno = apellido_paterno || user.apellido_paterno;
        user.apellido_materno = apellido_materno || user.apellido_materno;
        user.email = email || user.email;
        user.rol = rol || user.rol;

        await user.save();

        res.json({
            message: 'Usuario actualizado con éxito',
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido_paterno: user.apellido_paterno,
                apellido_materno: user.apellido_materno,
                email: user.email,
                rol: user.rol,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario, intenta mas tarde.' });
    }
};