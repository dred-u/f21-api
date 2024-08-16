import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import productsRoutes from './routes/products.routes.js';
import usersRoutes from './routes/users.routes.js'
import ordersRoutes from './routes/orders.routes.js';
import storesRoutes from './routes/stores.routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: '*',
    methods: 'GET,PATCH,PUT,POST,DELETE',
    credentials: true,
}));

app.use(morgan('dev'))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    

// Deshabilitar el almacenamiento en caché
app.use((req, res, next) => {
    req.headers['if-none-match'] = undefined;
    req.headers['if-modified-since'] = undefined;
    req.params['if-none-match'] = undefined;
    req.params['if-modified-since'] = undefined;
    next();
});

// http://<IP>>:3000/images/<img> para acceder a las imagenes guardadas
app.use('/images/', express.static(path.join(__dirname, '../images')));
app.use('/api/', productsRoutes);
app.use('/api/', usersRoutes);
app.use('/api/', ordersRoutes);
app.use('/api/', storesRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'ruta no encontrada'
    })
})


export default app;