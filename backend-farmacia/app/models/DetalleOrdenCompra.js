export default (sequelize, Sequelize) => {
  const DetalleOrdenCompra = sequelize.define('DetalleOrdenCompra', {
    NroOrdenC: { 
      type: Sequelize.INTEGER, 
      primaryKey: true 
    },
    CodMedicamento: { 
      type: Sequelize.INTEGER, 
      primaryKey: true 
    },
    descripcion: Sequelize.STRING,
    cantidad: Sequelize.INTEGER,
    precio: Sequelize.FLOAT,
    montouni: Sequelize.FLOAT,
  }, {
    tableName: 'DetalleOrdenCompra',
    timestamps: false,
  });

  return DetalleOrdenCompra;
};
