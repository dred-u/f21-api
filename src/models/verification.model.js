import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Usuario from './user.model.js';
import Sucursal from './store.model.js';
import Orden from './order.model.js'

const Verificacion = sequelize.define('Verificacion', {
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
    id_orden: { 
        type: DataTypes.INTEGER,
        references:{
            model:Orden,
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
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'verificaciones',
    timestamps: false
});

Verificacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Verificacion.belongsTo(Orden, { foreignKey: 'id_orden' });

export default  Verificacion;
