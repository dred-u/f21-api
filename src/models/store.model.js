import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Sucursal = sequelize.define('Sucursal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'sucursales',
    timestamps: false
});

export default Sucursal;
