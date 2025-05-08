import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import OrdenCompra from './OrdenCompra.js';
import Medicamento from './Medicamento.js';

const DetalleOrdenCompra = sequelize.define('DetalleOrdenCompra', {
  NroOrdenC: { type: DataTypes.INTEGER, primaryKey: true },
  CodMedicamento: { type: DataTypes.INTEGER, primaryKey: true },
  descripcion: DataTypes.STRING,
  cantidad: DataTypes.INTEGER,
  precio: DataTypes.FLOAT,
  montouni: DataTypes.FLOAT,
}, {
  tableName: 'DetalleOrdenCompra',
  timestamps: false,
});

OrdenCompra.hasMany(DetalleOrdenCompra, { foreignKey: 'NroOrdenC' });
DetalleOrdenCompra.belongsTo(OrdenCompra, { foreignKey: 'NroOrdenC' });

Medicamento.hasMany(DetalleOrdenCompra, { foreignKey: 'CodMedicamento' });
DetalleOrdenCompra.belongsTo(Medicamento, { foreignKey: 'CodMedicamento' });

export default DetalleOrdenCompra;
