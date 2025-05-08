import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Medicamento = sequelize.define('Medicamento', {
  CodMedicamento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descripcionMed: DataTypes.STRING,
  fechaFabricacion: DataTypes.DATE,
  fechaVencimiento: DataTypes.DATE,
  Presentacion: DataTypes.STRING,
  stock: DataTypes.INTEGER,
  precioVentaUni: DataTypes.FLOAT,
  precioVentaPres: DataTypes.FLOAT,
  Marca: DataTypes.STRING
}, {
  tableName: 'Medicamento',
  timestamps: false,
});

export default Medicamento;
