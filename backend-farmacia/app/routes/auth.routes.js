import express from "express";
import { signup, signin, getRoles } from "../controllers/auth.controller.js";
import {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
} from "../middlewares/verifySignUp.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();

// Registro de usuario
// POST /api/auth/signup
router.post(
  "/signup",
  [checkDuplicateUsernameOrEmail, checkRolesExisted],
  signup
);

// Login de usuario
// POST /api/auth/signin
router.post("/signin", signin);

// Obtener roles
// GET /api/auth/roles
router.get("/roles", verifyToken, getRoles);

export default router;
