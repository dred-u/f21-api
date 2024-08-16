import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Producto = sequelize.define('Productos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    genero: {
        type: DataTypes.ENUM('hombre', 'mujer'),
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('camisa','camiseta','pantalon','chamarra','jean','sweater','blusa','falda','vestido','mallas','pants','pijama','short','sudadera'),
        allowNull: false
    }
}, {
    tableName: 'productos',
    timestamps: false
});

export default Producto;
