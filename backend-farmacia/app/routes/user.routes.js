import express from "express";
import {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard
} from "../controllers/user.controller.js";
import { verifyToken, isAdmin, isModerator } from "../middlewares/authJwt.js";

const router = express.Router();

// Público
// GET /api/users/all
router.get("/all", allAccess);

// Sólo usuario autenticado
// GET /api/users/user
router.get("/user", [verifyToken], userBoard);

// Sólo moderador o admin
// GET /api/users/mod
router.get("/mod", [verifyToken, isModerator], moderatorBoard);

// Sólo admin
// GET /api/users/admin
router.get("/admin", [verifyToken, isAdmin], adminBoard);

export default router;
