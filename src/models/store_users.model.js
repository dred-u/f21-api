import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Usuario from './user.model.js';
import Sucursal from './store.model.js';


const Usuario_sucursal = sequelize.define('Usuario_sucursal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        references:{
            model:Usuario,
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
    puesto: {
        type: DataTypes.ENUM('vendedor', 'cajero','almacenista'),
        allowNull: true
    }
}, {
    tableName: 'usuarios_sucursales',
    timestamps: false
});

Usuario_sucursal.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Usuario_sucursal.belongsTo(Sucursal, { foreignKey: 'id_sucursal' });

export default  Usuario_sucursal;
