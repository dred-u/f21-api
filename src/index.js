import app from "./app.js";
import {PORT} from './config.js'
import sequelize from './db.js'; 

app.listen(PORT, () => console.log('Servidor funcionando en el puerto', PORT));

/*
sequelize.sync()
    .then(() => {
        console.log('\nBase de datos y tablas creadas');
        app.listen(PORT, () => {
            console.log(`Servidor funcionando en el puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });
*/ 