import jtkn from 'jsonwebtoken';
import {SECRET_KEY} from '../config.js'

//NOTA IMPORTANTE: importar esta constante en una ruta permite validar que el usuario este logeado para acceder a un metodo  
const authRequired = (req, res, next) => {
    const { token } = req.body
    if (!token) {
        return res.status(401).json({ message: 'Autorizacion denegada' })
    }

    jtkn.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalido' })
        }
        req.user = user;

        next();
    })
};

export default authRequired;