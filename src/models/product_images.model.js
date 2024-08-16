import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Producto from './product.model.js';

const Imagen_producto = sequelize.define('Imagen_producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_producto: {
        type: DataTypes.INTEGER,
        references:{
            model:Producto,
            key:'id' 
        }
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    qr: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'productos_imagenes',
    timestamps: false
});

Imagen_producto.belongsTo(Producto, { foreignKey: 'id_producto' });
Producto.hasOne(Imagen_producto, { foreignKey: 'id_producto' });

export default Imagen_producto;
