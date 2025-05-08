import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Laboratorio = sequelize.define('Laboratorio', {
  CodLab: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  razonSocial: DataTypes.STRING,
  direccion: DataTypes.STRING,
  telefono: DataTypes.STRING,
  email: DataTypes.STRING,
  contacto: DataTypes.STRING
}, {
  tableName: 'Laboratorio',
  timestamps: false,
});

export default Laboratorio;
