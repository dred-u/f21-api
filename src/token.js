import jtkn from 'jsonwebtoken';
import {SECRET_KEY} from './config.js'

export default function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jtkn.sign(
            payload,
            SECRET_KEY,
            {
                expiresIn: "1d",
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
}
