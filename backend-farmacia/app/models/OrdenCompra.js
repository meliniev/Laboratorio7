import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Laboratorio from './Laboratorio.js';

const OrdenCompra = sequelize.define('OrdenCompra', {
  NroOrdenC: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fechaEmision: DataTypes.DATE,
  Situacion: DataTypes.STRING,
  Total: DataTypes.FLOAT,
  NrofacturaProv: DataTypes.STRING
}, {
  tableName: 'OrdenCompra',
  timestamps: false,
});

Laboratorio.hasMany(OrdenCompra, { foreignKey: 'CodLab' });
OrdenCompra.belongsTo(Laboratorio, { foreignKey: 'CodLab' });

export default OrdenCompra;
