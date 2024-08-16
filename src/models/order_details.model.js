import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Producto from './product.model.js';
import Orden from './order.model.js'
import Sucursal from './store.model.js';


const Detalles_orden = sequelize.define('Detalles_orden', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_orden: {
        type: DataTypes.INTEGER,
        references:{
            model:Orden,
            key:'id' 
        }
    },
    id_producto: {
        type: DataTypes.INTEGER,
        references:{
            model:Producto,
            key:'id' 
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'detalles_orden',
    timestamps: false
});

Detalles_orden.belongsTo(Producto, { foreignKey: 'id_producto' });

export default Detalles_orden;
