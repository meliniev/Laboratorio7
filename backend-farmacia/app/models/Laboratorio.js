export default (sequelize, Sequelize) => {
  const Laboratorio = sequelize.define('Laboratorio', {
    CodLab: { 
      type: Sequelize.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    razonSocial: {
      type: Sequelize.STRING,
      allowNull: false
    },
    direccion: Sequelize.STRING,
    telefono: Sequelize.STRING,
    email: Sequelize.STRING,
    contacto: Sequelize.STRING
  }, {
    tableName: 'Laboratorio',
    timestamps: false,
  });

  return Laboratorio;
};
