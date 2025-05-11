export default (sequelize, Sequelize) => {
  const Medicamento = sequelize.define('Medicamento', {
    CodMedicamento: { 
      type: Sequelize.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    descripcionMed: Sequelize.STRING,
    fechaFabricacion: Sequelize.DATE,
    fechaVencimiento: Sequelize.DATE,
    Presentacion: Sequelize.STRING,
    stock: Sequelize.INTEGER,
    precioVentaUni: Sequelize.FLOAT,
    precioVentaPres: Sequelize.FLOAT,
    Marca: Sequelize.STRING,
    CodLab: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Medicamento',
    timestamps: false,
  });

  return Medicamento;
};
