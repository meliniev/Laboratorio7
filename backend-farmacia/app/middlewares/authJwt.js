import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const { user: User, role: Role } = db;

export const verifyToken = async (req, res, next) => {
  console.log("Ejecutando verifyToken middleware");
  console.log("Headers recibidos:", req.headers);
  // Obtener token de x-access-token o de Authorization (con o sin Bearer)
  let token = req.headers["x-access-token"] || req.headers.authorization;
  
  if (!token) {
    console.log("No se proporcionó token");
    return res.status(403).json({ message: "No token provided!" });
  }
  
  try {
    // Eliminar "Bearer " si existe
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }
    console.log("Token procesado:", token);
    
    const decoded = jwt.verify(token, authConfig.secret);
    req.userId = decoded.id;
    console.log("ID de usuario decodificado:", req.userId);
    
    const user = await User.findByPk(req.userId);
    if (!user) {
      console.log("Usuario no encontrado con ID:", req.userId);
      return res.status(401).json({ message: "Unauthorized!" });
    }
    
    console.log("Usuario autenticado correctamente:", user.username);
    next();
  } catch (err) {
    console.error("Error al verificar token:", err);
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    console.log("Ejecutando isAdmin middleware para usuario ID:", req.userId);
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    console.log("Roles del usuario:", roles.map(r => r.name));
    
    const isAdmin = roles.some(role => role.name === "admin");
    if (!isAdmin) {
      console.log("El usuario no tiene rol de administrador");
      return res.status(403).json({ message: "Require Admin Role!" });
    }
    
    console.log("Usuario verificado como administrador");
    next();
  } catch (error) {
    console.error("Error en middleware isAdmin:", error);
    res.status(500).json({ message: error.message });
  }
};

export const isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    const isModerator = roles.some(role => role.name === "moderator");
    if (!isModerator) return res.status(403).json({ message: "Require Moderator Role!" });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};