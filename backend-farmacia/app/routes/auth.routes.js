import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";
import {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
} from "../middlewares/verifySignUp.js";

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

export default router;
