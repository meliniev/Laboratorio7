import { Router } from "express";
import { verifyToken, isAdmin, isModerator } from "../middlewares/authJwt.js";
import * as farmController from "../controllers/farmacia.controller.js";

const router = Router();

/**
 * RUTAS PARA MEDICAMENTOS
 */
router.post(
  "/medicamentos",
  [verifyToken, isAdmin],
  farmController.createMedicamento
);
router.get(
  "/medicamentos",
  [verifyToken],
  farmController.listMedicamentos
);
router.get(
  "/medicamentos/:id",
  [verifyToken],
  farmController.getMedicamentoById
);
router.put(
  "/medicamentos/:id",
  [verifyToken, isAdmin],
  farmController.updateMedicamento
);
router.delete(
  "/medicamentos/:id",
  [verifyToken, isAdmin],
  farmController.deleteMedicamento
);

/**
 * RUTAS PARA LABORATORIOS
 */
router.post(
  "/laboratorios",
  [verifyToken, isAdmin],
  farmController.createLaboratorio
);
router.get(
  "/laboratorios",
  [verifyToken],
  farmController.listLaboratorios
);
router.get(
  "/laboratorios/:id",
  [verifyToken],
  farmController.getLaboratorioById
);
router.put(
  "/laboratorios/:id",
  [verifyToken, isAdmin],
  farmController.updateLaboratorio
);
router.delete(
  "/laboratorios/:id",
  [verifyToken, isAdmin],
  farmController.deleteLaboratorio
);

/**
 * RUTAS PARA ÓRDENES DE COMPRA
 */
router.post(
  "/ordenes-compra",
  [verifyToken],
  farmController.createOrdenCompra
);
router.get(
  "/ordenes-compra",
  [verifyToken],
  farmController.listOrdenesCompra
);
router.get(
  "/ordenes-compra/:id",
  [verifyToken],
  farmController.getOrdenCompraById
);
router.put(
  "/ordenes-compra/:id",
  [verifyToken, isAdmin],
  farmController.updateOrdenCompra
);
router.delete(
  "/ordenes-compra/:id",
  [verifyToken, isAdmin],
  farmController.deleteOrdenCompra
);

/**
 * RUTAS PARA DETALLES DE ORDEN DE COMPRA
 */
router.post(
  "/detalles-orden",
  [verifyToken],
  farmController.createDetalleOrden
);
router.get(
  "/detalles-orden",
  [verifyToken],
  farmController.listDetallesOrden
);
router.get(
  "/detalles-orden/:nro/:cod",
  [verifyToken],
  farmController.getDetalleByPK
);
router.put(
  "/detalles-orden/:nro/:cod",
  [verifyToken, isAdmin],
  farmController.updateDetalleOrden
);
router.delete(
  "/detalles-orden/:nro/:cod",
  [verifyToken, isAdmin],
  farmController.deleteDetalleOrden
);

export default router;
