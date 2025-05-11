import db from "../models/index.js";

const { Actividad, user: User } = db;

// Registrar una nueva actividad en el sistema
export const registrarActividad = async (tipoActividad, descripcion, entidad, idEntidad, idUsuario, detalles = null) => {
  try {
    // Si no se proporcionó un ID de usuario, lo marcamos claramente
    if (!idUsuario) {
      console.warn(`⚠️ Actividad sin usuario: ${tipoActividad} - ${descripcion}`);
    }
    
    const nuevaActividad = await Actividad.create({
      tipoActividad,
      descripcion,
      entidad,
      idEntidad,
      idUsuario: idUsuario || null,
      detalles: detalles ? JSON.stringify(detalles) : null,
      fecha: new Date()
    });

    return nuevaActividad;
  } catch (error) {
    console.error("Error al registrar actividad:", error);
    throw error;
  }
};

// Obtener lista de actividades recientes
export const obtenerActividades = async (req, res) => {
  try {
    const { limit = 50, offset = 0, tipo, entidad, usuarioId } = req.query;
    
    // Construir condiciones de consulta
    const where = {};
    if (tipo) where.tipoActividad = tipo;
    if (entidad) where.entidad = entidad;
    if (usuarioId) where.idUsuario = usuarioId;
    
    // Obtener actividades con paginación
    const actividades = await Actividad.findAll({
      where,
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['fecha', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Contar total de registros para paginación
    const total = await Actividad.count({ where });
    
    res.json({
      actividades,
      paginacion: {
        total,
        offset: parseInt(offset),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  registrarActividad,
  obtenerActividades
};
