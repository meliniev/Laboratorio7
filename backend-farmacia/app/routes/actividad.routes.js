import express from 'express';
import { verifyToken } from "../middlewares/authJwt.js";
import { obtenerActividades } from "../controllers/actividad.controller.js";
import { isModeratorOrAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Ruta para obtener actividades (solo accesible para moderadores y administradores)
router.get("/", [verifyToken, isModeratorOrAdmin], obtenerActividades);

export default router;
