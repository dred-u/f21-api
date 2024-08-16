import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Usuario from './user.model.js';
import Sucursal from './store.model.js';
import Producto from './product.model.js'


const Captura = sequelize.define('Captura', {
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
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'capturas',
    timestamps: false
});

Captura.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Captura.belongsTo(Producto, { foreignKey: 'id_producto' });

export default Captura;
