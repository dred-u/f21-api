import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Sucursal from './store.model.js';

const Orden = sequelize.define('Orden', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_sucursal: {
        type: DataTypes.INTEGER,
        references:{
            model:Sucursal,
            key:'id' 
        }
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pendiente', 'completada','incompleta'),
        allowNull: false
    }
}, {
    tableName: 'ordenes',
    timestamps: false
});

Orden.belongsTo(Sucursal, { foreignKey: 'id_sucursal' });
Sucursal.hasMany(Orden, { foreignKey: 'id_sucursal' });

export default Orden;
