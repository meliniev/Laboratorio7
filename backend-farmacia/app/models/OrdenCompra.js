export default (sequelize, Sequelize) => {
  const OrdenCompra = sequelize.define('OrdenCompra', {
    NroOrdenC: { 
      type: Sequelize.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    fechaEmision: Sequelize.DATE,
    Situacion: Sequelize.STRING,
    Total: Sequelize.FLOAT,
    NrofacturaProv: Sequelize.STRING,
    CodLab: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'OrdenCompra',
    timestamps: false,
  });

  return OrdenCompra;
};
