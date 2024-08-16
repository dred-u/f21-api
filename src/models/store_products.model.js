import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Producto from './product.model.js';
import Sucursal from './store.model.js';


const Producto_sucursal = sequelize.define('Producto_sucursal', {
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
    id_sucursal: {
        type: DataTypes.INTEGER,
        references:{
            model:Sucursal,
            key:'id' 
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'sucursales_productos',
    timestamps: false
});

Producto_sucursal.belongsTo(Producto, { foreignKey: 'id_producto' });
Producto_sucursal.belongsTo(Sucursal, { foreignKey: 'id_sucursal' });

export default Producto_sucursal;
