import Sequelize from "sequelize";
import sequelize from "../config/db.config.js";
import userModel from "./user.model.js";
import roleModel from "./role.model.js";
import MedicamentoModel from "./Medicamento.js";
import OrdenCompraModel from "./OrdenCompra.js";
import DetalleOrdenCompraModel from "./DetalleOrdenCompra.js";
import LaboratorioModel from "./Laboratorio.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Inicialización de modelos
db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);
db.Medicamento = MedicamentoModel(sequelize, Sequelize);
db.OrdenCompra = OrdenCompraModel(sequelize, Sequelize);
db.DetalleOrdenCompra = DetalleOrdenCompraModel(sequelize, Sequelize);
db.Laboratorio = LaboratorioModel(sequelize, Sequelize);


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

// Asociaciones corregidas entre Laboratorio y Medicamento
db.Laboratorio.hasMany(db.Medicamento, { foreignKey: 'CodLab' });
db.Medicamento.belongsTo(db.Laboratorio, { foreignKey: 'CodLab' });

// Asociaciones entre Laboratorio y OrdenCompra
db.Laboratorio.hasMany(db.OrdenCompra, { foreignKey: 'CodLab' });
db.OrdenCompra.belongsTo(db.Laboratorio, { foreignKey: 'CodLab' });

// Asociaciones entre OrdenCompra y DetalleOrdenCompra
db.OrdenCompra.hasMany(db.DetalleOrdenCompra, { foreignKey: 'NroOrdenC' });
db.DetalleOrdenCompra.belongsTo(db.OrdenCompra, { foreignKey: 'NroOrdenC' });

// Asociaciones entre Medicamento y DetalleOrdenCompra
db.Medicamento.hasMany(db.DetalleOrdenCompra, { foreignKey: 'CodMedicamento' });
db.DetalleOrdenCompra.belongsTo(db.Medicamento, { foreignKey: 'CodMedicamento' });

export default db;
