import Sequelize from "sequelize";
import dbConfig from "../config/db.config.js";
import userModel from "./user.model.js";
import roleModel from "./role.model.js";
import MedicamentoModel from "./Medicamento.js";
import OrdenCompraModel from "./OrdenCompra.js";
import DetalleOrdenCompraModel from "./DetalleOrdenCompra.js";
import LaboratorioModel from "./Laboratorio.js";

const db = {};
db.Sequelize  = Sequelize;
db.sequelize  = dbConfig;


db.user       = userModel(db.sequelize, Sequelize);
db.role       = roleModel(db.sequelize, Sequelize);


db.Medicamento          = MedicamentoModel;
db.OrdenCompra          = OrdenCompraModel;
db.DetalleOrdenCompra   = DetalleOrdenCompraModel;
db.Laboratorio          = LaboratorioModel;


db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey:  "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey:  "roleId",
  as: "roles",
});


db.Laboratorio.hasMany(db.OrdenCompra, { foreignKey: 'CodLab' });
db.OrdenCompra.belongsTo(db.Laboratorio, { foreignKey: 'CodLab' });

db.OrdenCompra.hasMany(db.DetalleOrdenCompra, { foreignKey: 'NroOrdenC' });
db.DetalleOrdenCompra.belongsTo(db.OrdenCompra, { foreignKey: 'NroOrdenC' });

db.Medicamento.hasMany(db.DetalleOrdenCompra, { foreignKey: 'CodMedicamento' });
db.DetalleOrdenCompra.belongsTo(db.Medicamento, { foreignKey: 'CodMedicamento' });

export default db;
