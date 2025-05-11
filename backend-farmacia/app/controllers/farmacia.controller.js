import db from "../models/index.js";
import { registrarActividad } from "./actividad.controller.js";

const {
  Medicamento,
  Laboratorio,
  OrdenCompra,
  DetalleOrdenCompra,
} = db;

/**
 * -----------------------
 * Medicamentos
 * -----------------------
 */
export const createMedicamento = async (req, res) => {
  try {
    // Validar campos obligatorios
    if (!req.body.descripcionMed || !req.body.stock) {
      return res.status(400).json({ error: "Los campos descripción y stock son obligatorios" });
    }
    
    // Verificar si el laboratorio existe si se proporciona CodLab
    if (req.body.CodLab) {
      const laboratorio = await Laboratorio.findByPk(req.body.CodLab);
      if (!laboratorio) {
        return res.status(400).json({ error: "El laboratorio seleccionado no existe" });
      }
    }
    
    // Validar fechas de fabricación y caducidad
    if (req.body.FechaFabricacion && req.body.FechaCaducidad) {
      const fechaFabricacion = new Date(req.body.FechaFabricacion);
      const fechaCaducidad = new Date(req.body.FechaCaducidad);
      
      if (fechaCaducidad <= fechaFabricacion) {
        return res.status(400).json({ 
          error: "La fecha de caducidad debe ser posterior a la fecha de fabricación" 
        });
      }
    }
    
    const med = await Medicamento.create(req.body);    // Registrar actividad
    try {
      console.log("Registrando creación de medicamento - Usuario:", {
        userId: req.userId,
        medicamentoId: med.CodMedicamento,
        medicamentoNombre: med.descripcionMed
      });
      
      if (!req.userId) {
        console.warn("⚠️ No hay ID de usuario disponible para registrar la actividad de creación");
      }
      
      await registrarActividad(
        'creacion',
        `Se creó el medicamento: ${med.descripcionMed}`,
        'medicamento',
        med.CodMedicamento,
        req.userId, // El ID del usuario que realiza la acción
        { medicamento: med }
      );
    } catch (err) {
      console.error("Error al registrar actividad:", err);
    }
    
    res.status(201).json(med);
  } catch (err) {
    console.error("Error al crear medicamento:", err);
    res.status(500).json({ error: err.message });
  }
};

export const listMedicamentos = async (req, res) => {
  try {
    // Si la columna CodLab no existe todavía, mostremos los medicamentos sin la relación
    try {
      const meds = await Medicamento.findAll({
        include: [{
          model: Laboratorio,
          attributes: ['CodLab', 'razonSocial'],
          required: false  // LEFT JOIN en lugar de INNER JOIN
        }]
      });
      return res.json(meds);
    } catch (findError) {
      console.error("Error detallado en findAll con relación:", findError);
      
      // Si falla con la relación, intentemos sin ella
      const meds = await Medicamento.findAll();
      return res.json(meds);
    }
  } catch (err) {
    console.error("Error al listar medicamentos:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getMedicamentoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID no sea undefined o nulo
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "ID de medicamento inválido" });
    }
    
    // Intentar obtener el medicamento con la relación de laboratorio
    try {
      const med = await Medicamento.findByPk(id, {
        include: [{
          model: Laboratorio,
          attributes: ['CodLab', 'razonSocial'],
          required: false
        }]
      });
      if (!med) return res.status(404).json({ message: "Medicamento no encontrado." });
      return res.json(med);
    } catch (findError) {
      console.error("Error detallado en findByPk con relación:", findError);
      
      // Si falla con la relación, intentemos sin ella
      const med = await Medicamento.findByPk(id);
      if (!med) return res.status(404).json({ message: "Medicamento no encontrado." });
      return res.json(med);
    }
  } catch (err) {
    console.error("Error al obtener medicamento:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID no sea undefined o nulo
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "ID de medicamento inválido" });
    }
    
    // Validar campos obligatorios
    if (!req.body.descripcionMed || !req.body.stock) {
      return res.status(400).json({ error: "Los campos descripción y stock son obligatorios" });
    }
    
    // Verificar si el laboratorio existe si se proporciona CodLab
    if (req.body.CodLab) {
      const laboratorio = await Laboratorio.findByPk(req.body.CodLab);
      if (!laboratorio) {
        return res.status(400).json({ error: "El laboratorio seleccionado no existe" });
      }
    }
    
    // Validar fechas de fabricación y caducidad
    if (req.body.FechaFabricacion && req.body.FechaCaducidad) {
      const fechaFabricacion = new Date(req.body.FechaFabricacion);
      const fechaCaducidad = new Date(req.body.FechaCaducidad);
      
      if (fechaCaducidad <= fechaFabricacion) {
        return res.status(400).json({ 
          error: "La fecha de caducidad debe ser posterior a la fecha de fabricación" 
        });
      }
    }
    
    // Si CodLab existe en el body pero no en la tabla, lo quitamos para evitar errores
    try {
      // Verificar si la columna CodLab existe
      const [colResult] = await db.sequelize.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Medicamento' AND COLUMN_NAME = 'CodLab'"
      );
      
      // Si CodLab no existe en la tabla pero está en el body, lo quitamos
      if (colResult.length === 0 && req.body.CodLab) {
        delete req.body.CodLab;
      }
      
      const [updated] = await Medicamento.update(req.body, { where: { CodMedicamento: id } });
      if (!updated) return res.status(404).json({ message: "Medicamento no encontrado." });
        const med = await Medicamento.findByPk(id, {
        include: [{
          model: Laboratorio,
          attributes: ['CodLab', 'razonSocial'],
          required: false
        }]
      });
        // Registrar actividad
      try {
        console.log("ID de usuario al actualizar medicamento:", req.userId);
        await registrarActividad(
          'modificacion',
          `Se actualizó el medicamento: ${med.descripcionMed}`,
          'medicamento',
          med.CodMedicamento,
          req.userId,
          { cambios: req.body }
        );
      } catch (err) {
        console.error("Error al registrar actividad de actualización de medicamento:", err);
      }
      
      res.json(med);
    } catch (err) {
      console.error("Error al actualizar medicamento:", err);
      res.status(500).json({ error: err.message });
    }
  } catch (err) {
    console.error("Error general al actualizar medicamento:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Primero obtenemos el medicamento para tener su info antes de eliminarlo
    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }
    
    // Guardar información del medicamento para el registro de actividad
    const infoMedicamento = {
      CodMedicamento: medicamento.CodMedicamento,
      descripcionMed: medicamento.descripcionMed,
      stock: medicamento.stock,
      precio: medicamento.precio
    };
    
    const deleted = await Medicamento.destroy({ where: { CodMedicamento: id } });
      // Registrar actividad
    try {
      console.log("Registrando eliminación de medicamento - Usuario:", {
        userId: req.userId,
        medicamentoId: id,
        medicamentoNombre: infoMedicamento.descripcionMed
      });
      
      if (!req.userId) {
        console.warn("⚠️ No hay ID de usuario disponible para registrar la actividad de eliminación");
      }
      
      await registrarActividad(
        'eliminacion',
        `Se eliminó el medicamento: ${infoMedicamento.descripcionMed}`,
        'medicamento',
        id,
        req.userId,
        { medicamentoEliminado: infoMedicamento }
      );
    } catch (err) {
      console.error("Error al registrar actividad de eliminación de medicamento:", err);
    }
    
    res.json({ message: "Eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar medicamento:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * -----------------------
 * Laboratorios
 * -----------------------
 */
export const createLaboratorio = async (req, res) => {
  try {
    const lab = await Laboratorio.create(req.body);
    res.status(201).json(lab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listLaboratorios = async (req, res) => {
  try {
    const labs = await Laboratorio.findAll();
    res.json(labs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLaboratorioById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID no sea undefined o nulo
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "ID de laboratorio inválido" });
    }
    
    const lab = await Laboratorio.findByPk(id);
    if (!lab) return res.status(404).json({ message: "Laboratorio no encontrado." });
    res.json(lab);
  } catch (err) {
    console.error("Error al obtener laboratorio:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateLaboratorio = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID no sea undefined o nulo
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "ID de laboratorio inválido" });
    }
    
    // Validar que existan los campos requeridos
    if (!req.body.razonSocial) {
      return res.status(400).json({ message: "La razón social es requerida" });
    }
    
    const [updated] = await Laboratorio.update(req.body, { where: { CodLab: id } });
    if (!updated) return res.status(404).json({ message: "Laboratorio no encontrado." });
    
    const lab = await Laboratorio.findByPk(id);
    res.json(lab);
  } catch (err) {
    console.error("Error al actualizar laboratorio:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteLaboratorio = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID no sea undefined o nulo
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "ID de laboratorio inválido" });
    }
    
    // Verificar que no tenga medicamentos asociados
    const medicamentosAsociados = await Medicamento.findAll({ where: { CodLab: id } });
    if (medicamentosAsociados && medicamentosAsociados.length > 0) {
      return res.status(400).json({ 
        message: "No se puede eliminar el laboratorio porque tiene medicamentos asociados" 
      });
    }
    
    // Verificar que no tenga órdenes de compra asociadas
    const ordenesAsociadas = await OrdenCompra.findAll({ where: { CodLab: id } });
    if (ordenesAsociadas && ordenesAsociadas.length > 0) {
      return res.status(400).json({ 
        message: "No se puede eliminar el laboratorio porque tiene órdenes de compra asociadas" 
      });
    }
    
    const deleted = await Laboratorio.destroy({ where: { CodLab: id } });
    if (!deleted) return res.status(404).json({ message: "Laboratorio no encontrado." });
    res.json({ message: "Eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar laboratorio:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * -----------------------
 * Ordenes de Compra
 * -----------------------
 */
export const createOrdenCompra = async (req, res) => {
  try {
    // Validar campos requeridos
    if (!req.body.CodLab) {
      return res.status(400).json({ 
        error: "El código del laboratorio (CodLab) es obligatorio" 
      });
    }
    
    // Verificar que exista el laboratorio
    const laboratorio = await Laboratorio.findByPk(req.body.CodLab);
    if (!laboratorio) {
      return res.status(400).json({ error: "El laboratorio seleccionado no existe" });
    }
    
    // Si no se proporciona fechaEmision, usar la fecha actual
    if (!req.body.fechaEmision) {
      req.body.fechaEmision = new Date();
    }
    
    // Si no se proporciona Situacion, usar "Pendiente"
    if (!req.body.Situacion) {
      req.body.Situacion = "Pendiente";
    }
    
    const oc = await OrdenCompra.create(req.body);
    res.status(201).json(oc);
  } catch (err) {
    console.error("Error al crear orden de compra:", err);
    res.status(500).json({ error: err.message });
  }
};

export const listOrdenesCompra = async (req, res) => {
  try {
    const ocs = await OrdenCompra.findAll({ 
      include: Laboratorio,
      order: [['NroOrdenC', 'DESC']] // Ordenar por número de orden de forma descendente
    });
    res.json(ocs);
  } catch (err) {
    console.error("Error al listar órdenes de compra:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getOrdenCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID no sea undefined o nulo
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "ID de orden de compra inválido" });
    }
    
    const oc = await OrdenCompra.findByPk(id, {
      include: [ 
        Laboratorio, 
        { 
          model: DetalleOrdenCompra, 
          include: Medicamento 
        } 
      ]
    });
    if (!oc) return res.status(404).json({ message: "Orden de compra no encontrada." });
    res.json(oc);
  } catch (err) {
    console.error("Error al obtener orden de compra:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateOrdenCompra = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID no sea undefined o nulo
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "ID de orden de compra inválido" });
    }
    
    // Verificar que exista el laboratorio si se proporciona CodLab
    if (req.body.CodLab) {
      const laboratorio = await Laboratorio.findByPk(req.body.CodLab);
      if (!laboratorio) {
        return res.status(400).json({ error: "El laboratorio seleccionado no existe" });
      }
    }
    
    const [updated] = await OrdenCompra.update(req.body, { where: { NroOrdenC: id } });
    if (!updated) return res.status(404).json({ message: "Orden de compra no encontrada." });
    
    const oc = await OrdenCompra.findByPk(id, {
      include: [ Laboratorio ]
    });
    res.json(oc);
  } catch (err) {
    console.error("Error al actualizar orden de compra:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrdenCompra = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID no sea undefined o nulo
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "ID de orden de compra inválido" });
    }
    
    // Verificar si tiene detalles asociados
    const detallesAsociados = await DetalleOrdenCompra.findAll({ where: { NroOrdenC: id } });
    if (detallesAsociados && detallesAsociados.length > 0) {
      // Eliminar primero los detalles asociados
      await DetalleOrdenCompra.destroy({ where: { NroOrdenC: id } });
    }
    
    const deleted = await OrdenCompra.destroy({ where: { NroOrdenC: id } });
    if (!deleted) return res.status(404).json({ message: "Orden de compra no encontrada." });
    res.json({ message: "Orden de compra eliminada correctamente." });
  } catch (err) {
    console.error("Error al eliminar orden de compra:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * -----------------------
 * Detalle de Orden de Compra
 * -----------------------
 */
export const createDetalleOrden = async (req, res) => {
  try {
    // Validar campos obligatorios
    if (!req.body.NroOrdenC || !req.body.CodMedicamento || !req.body.cantidad || !req.body.precio) {
      return res.status(400).json({ 
        message: "Los campos NroOrdenC, CodMedicamento, cantidad y precio son obligatorios" 
      });
    }
    
    // Verificar que exista la orden de compra
    const ordenCompra = await OrdenCompra.findByPk(req.body.NroOrdenC);
    if (!ordenCompra) {
      return res.status(400).json({ message: "La orden de compra indicada no existe" });
    }
    
    // Verificar que exista el medicamento
    const medicamento = await Medicamento.findByPk(req.body.CodMedicamento);
    if (!medicamento) {
      return res.status(400).json({ message: "El medicamento indicado no existe" });
    }
    
    // Calcular el montouni si no se proporciona
    if (!req.body.montouni) {
      req.body.montouni = parseFloat(req.body.precio) * parseInt(req.body.cantidad);
    }
    
    const detalle = await DetalleOrdenCompra.create(req.body);
    
    // Actualizar el total de la orden de compra
    const detallesOrden = await DetalleOrdenCompra.findAll({ 
      where: { NroOrdenC: req.body.NroOrdenC } 
    });
    
    const nuevoTotal = detallesOrden.reduce((sum, item) => {
      return sum + (parseFloat(item.precio) * parseInt(item.cantidad));
    }, 0);
    
    await OrdenCompra.update(
      { Total: nuevoTotal }, 
      { where: { NroOrdenC: req.body.NroOrdenC } }
    );
    
    res.status(201).json(detalle);
  } catch (err) {
    console.error("Error al crear detalle de orden:", err);
    res.status(500).json({ error: err.message });
  }
};

export const listDetallesOrden = async (req, res) => {
  try {
    const detalles = await DetalleOrdenCompra.findAll({
      include: [ 
        {
          model: Medicamento,
          attributes: ['CodMedicamento', 'descripcionMed', 'Presentacion', 'Marca']
        }, 
        {
          model: OrdenCompra,
          attributes: ['NroOrdenC', 'fechaEmision', 'Situacion']
        } 
      ]
    });
    res.json(detalles);
  } catch (err) {
    console.error("Error al listar detalles de órdenes:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getDetalleByPK = async (req, res) => {
  try {
    const { nro, cod } = req.params;
    
    // Validar parámetros
    if (!nro || !cod || nro === 'undefined' || cod === 'undefined') {
      return res.status(400).json({ message: "Parámetros inválidos" });
    }
    
    const det = await DetalleOrdenCompra.findOne({
      where: { NroOrdenC: nro, CodMedicamento: cod },
      include: [
        {
          model: Medicamento,
          attributes: ['CodMedicamento', 'descripcionMed', 'Presentacion', 'Marca']
        }
      ]
    });
    if (!det) return res.status(404).json({ message: "Detalle de orden no encontrado." });
    res.json(det);
  } catch (err) {
    console.error("Error al obtener detalle de orden:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateDetalleOrden = async (req, res) => {
  try {
    const { nro, cod } = req.params;
    
    // Validar parámetros
    if (!nro || !cod || nro === 'undefined' || cod === 'undefined') {
      return res.status(400).json({ message: "Parámetros inválidos" });
    }
    
    // Validar que existan la orden y el medicamento si se van a cambiar
    if (req.body.NroOrdenC && req.body.NroOrdenC !== parseInt(nro)) {
      const ordenCompra = await OrdenCompra.findByPk(req.body.NroOrdenC);
      if (!ordenCompra) {
        return res.status(400).json({ message: "La orden de compra indicada no existe" });
      }
    }
    
    if (req.body.CodMedicamento && req.body.CodMedicamento !== parseInt(cod)) {
      const medicamento = await Medicamento.findByPk(req.body.CodMedicamento);
      if (!medicamento) {
        return res.status(400).json({ message: "El medicamento indicado no existe" });
      }
    }
    
    // Calcular el montouni si se cambia el precio o la cantidad
    if ((req.body.precio && req.body.cantidad) || 
        (req.body.precio && req.body.cantidad === undefined) || 
        (req.body.precio === undefined && req.body.cantidad)) {
      
      const detalleActual = await DetalleOrdenCompra.findOne({
        where: { NroOrdenC: nro, CodMedicamento: cod }
      });
      
      if (detalleActual) {
        const nuevoPrecio = req.body.precio || detalleActual.precio;
        const nuevaCantidad = req.body.cantidad || detalleActual.cantidad;
        req.body.montouni = parseFloat(nuevoPrecio) * parseInt(nuevaCantidad);
      }
    }
    
    const [updated] = await DetalleOrdenCompra.update(
      req.body,
      { where: { NroOrdenC: nro, CodMedicamento: cod } }
    );
    
    if (!updated) return res.status(404).json({ message: "Detalle de orden no encontrado." });
    
    // Actualizar el total de la orden de compra
    const detallesOrden = await DetalleOrdenCompra.findAll({ 
      where: { NroOrdenC: nro } 
    });
    
    const nuevoTotal = detallesOrden.reduce((sum, item) => {
      return sum + (parseFloat(item.precio) * parseInt(item.cantidad));
    }, 0);
    
    await OrdenCompra.update(
      { Total: nuevoTotal }, 
      { where: { NroOrdenC: nro } }
    );
    
    const det = await DetalleOrdenCompra.findOne({
      where: { NroOrdenC: nro, CodMedicamento: cod },
      include: [ Medicamento ]
    });
    
    res.json(det);
  } catch (err) {
    console.error("Error al actualizar detalle de orden:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteDetalleOrden = async (req, res) => {
  try {
    const { nro, cod } = req.params;
    
    // Validar parámetros
    if (!nro || !cod || nro === 'undefined' || cod === 'undefined') {
      return res.status(400).json({ message: "Parámetros inválidos" });
    }
    
    // Obtener el detalle antes de eliminarlo para actualizar el total después
    const detalle = await DetalleOrdenCompra.findOne({
      where: { NroOrdenC: nro, CodMedicamento: cod }
    });
    
    if (!detalle) {
      return res.status(404).json({ message: "Detalle de orden no encontrado." });
    }
    
    const deleted = await DetalleOrdenCompra.destroy({
      where: { NroOrdenC: nro, CodMedicamento: cod }
    });
    
    if (!deleted) {
      return res.status(500).json({ message: "Error al eliminar el detalle de orden." });
    }
    
    // Actualizar el total de la orden de compra
    const detallesOrden = await DetalleOrdenCompra.findAll({ 
      where: { NroOrdenC: nro } 
    });
    
    const nuevoTotal = detallesOrden.reduce((sum, item) => {
      return sum + (parseFloat(item.precio) * parseInt(item.cantidad));
    }, 0);
    
    await OrdenCompra.update(
      { Total: nuevoTotal }, 
      { where: { NroOrdenC: nro } }
    );
    
    res.json({ message: "Detalle de orden eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar detalle de orden:", err);
    res.status(500).json({ error: err.message });
  }
};
