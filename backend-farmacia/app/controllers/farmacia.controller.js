import db from "../models/index.js";

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
    const med = await Medicamento.create(req.body);
    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listMedicamentos = async (req, res) => {
  try {
    const meds = await Medicamento.findAll();
    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMedicamentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const med = await Medicamento.findByPk(id);
    if (!med) return res.status(404).json({ message: "No encontrado." });
    res.json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Medicamento.update(req.body, { where: { CodMedicamento: id } });
    if (!updated) return res.status(404).json({ message: "No encontrado." });
    const med = await Medicamento.findByPk(id);
    res.json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Medicamento.destroy({ where: { CodMedicamento: id } });
    if (!deleted) return res.status(404).json({ message: "No encontrado." });
    res.json({ message: "Eliminado correctamente." });
  } catch (err) {
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
    const lab = await Laboratorio.findByPk(id);
    if (!lab) return res.status(404).json({ message: "No encontrado." });
    res.json(lab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLaboratorio = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Laboratorio.update(req.body, { where: { CodLab: id } });
    if (!updated) return res.status(404).json({ message: "No encontrado." });
    const lab = await Laboratorio.findByPk(id);
    res.json(lab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLaboratorio = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Laboratorio.destroy({ where: { CodLab: id } });
    if (!deleted) return res.status(404).json({ message: "No encontrado." });
    res.json({ message: "Eliminado correctamente." });
  } catch (err) {
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
    const oc = await OrdenCompra.create(req.body);
    res.status(201).json(oc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listOrdenesCompra = async (req, res) => {
  try {
    const ocs = await OrdenCompra.findAll({ include: Laboratorio });
    res.json(ocs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrdenCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    const oc = await OrdenCompra.findByPk(id, {
      include: [ Laboratorio, { model: DetalleOrdenCompra, include: Medicamento } ]
    });
    if (!oc) return res.status(404).json({ message: "No encontrado." });
    res.json(oc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrdenCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await OrdenCompra.update(req.body, { where: { NroOrdenC: id } });
    if (!updated) return res.status(404).json({ message: "No encontrado." });
    const oc = await OrdenCompra.findByPk(id);
    res.json(oc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrdenCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OrdenCompra.destroy({ where: { NroOrdenC: id } });
    if (!deleted) return res.status(404).json({ message: "No encontrado." });
    res.json({ message: "Eliminada correctamente." });
  } catch (err) {
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
    const detalle = await DetalleOrdenCompra.create(req.body);
    res.status(201).json(detalle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listDetallesOrden = async (req, res) => {
  try {
    const detalles = await DetalleOrdenCompra.findAll({
      include: [ Medicamento, OrdenCompra ]
    });
    res.json(detalles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDetalleByPK = async (req, res) => {
  try {
    const { nro, cod } = req.params;
    const det = await DetalleOrdenCompra.findOne({
      where: { NroOrdenC: nro, CodMedicamento: cod }
    });
    if (!det) return res.status(404).json({ message: "No encontrado." });
    res.json(det);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDetalleOrden = async (req, res) => {
  try {
    const { nro, cod } = req.params;
    const [updated] = await DetalleOrdenCompra.update(
      req.body,
      { where: { NroOrdenC: nro, CodMedicamento: cod } }
    );
    if (!updated) return res.status(404).json({ message: "No encontrado." });
    const det = await DetalleOrdenCompra.findOne({
      where: { NroOrdenC: nro, CodMedicamento: cod }
    });
    res.json(det);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDetalleOrden = async (req, res) => {
  try {
    const { nro, cod } = req.params;
    const deleted = await DetalleOrdenCompra.destroy({
      where: { NroOrdenC: nro, CodMedicamento: cod }
    });
    if (!deleted) return res.status(404).json({ message: "No encontrado." });
    res.json({ message: "Eliminado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
