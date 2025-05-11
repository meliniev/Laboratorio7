import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";
import {
  listUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/admin.controller.js";

const router = express.Router();

// Listar todos los usuarios (solo admin)
router.get("/users", [verifyToken, isAdmin], listUsers);

// Obtener un usuario por ID (solo admin)
router.get("/users/:id", [verifyToken, isAdmin], getUserById);

// Actualizar un usuario (solo admin)
router.put("/users/:id", [verifyToken, isAdmin], updateUser);

// Eliminar un usuario (solo admin)
router.delete("/users/:id", [verifyToken, isAdmin], deleteUser);

export default router;
