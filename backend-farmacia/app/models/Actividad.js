// Modelo para la tabla de actividad reciente
export default (sequelize, Sequelize) => {
  return sequelize.define("Actividades", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipoActividad: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: "Tipo de actividad (login, creación, edición, eliminación, etc.)"
    },
    descripcion: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: "Descripción de la actividad realizada"
    },
    entidad: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: "Entidad sobre la que se realizó la acción (medicamento, usuario, laboratorio, etc.)"
    },
    idEntidad: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "ID de la entidad afectada (si corresponde)"
    },
    idUsuario: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "ID del usuario que realizó la acción"
    },
    fecha: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Fecha y hora de la actividad"
    },
    detalles: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Detalles adicionales en formato JSON"
    }
  });
};
