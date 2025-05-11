import db from "../models/index.js";

export const isModeratorOrAdmin = async (req, res, next) => {
  try {
    console.log("Verificando si el usuario es moderador o admin. ID:", req.userId);
    
    if (!req.userId) {
      console.error("No hay ID de usuario para verificar roles");
      return res.status(403).json({ 
        message: "No hay ID de usuario para verificar roles"
      });
    }
    
    const user = await db.user.findByPk(req.userId);
    if (!user) {
      console.error(`Usuario con ID ${req.userId} no encontrado en la base de datos`);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    const roles = await user.getRoles();
    console.log("Roles del usuario:", roles.map(role => role.name));
    
    const hasRequiredRole = roles.some(role => 
      role.name === "moderator" || role.name === "admin"
    );
    
    if (!hasRequiredRole) {
      console.log(`Usuario ${user.username} no tiene rol de moderador o admin`);
      return res.status(403).json({ 
        message: "Requiere rol de moderador o administrador"
      });
    }
    
    // Almacenar info de roles para uso en controladores
    req.userRoles = roles.map(r => r.name);
    console.log("Usuario autorizado como moderador/admin:", user.username);
    next();
  } catch (error) {
    console.error("Error verificando permisos de moderador/admin:", error);
    res.status(500).json({ message: error.message });
  }
};
