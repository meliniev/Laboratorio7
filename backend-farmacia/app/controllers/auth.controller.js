import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authConfig from "../config/auth.config.js";
import { registrarActividad } from "./actividad.controller.js";

const { user: User, role: Role } = db;

// Obtener los roles disponibles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ username, email, password: hashedPassword });
    const defaultRole = await Role.findOne({ where: { name: "user" } });
    await user.addRole(defaultRole);
    
    // Registrar actividad de creación de usuario
    try {
      // Como es un registro nuevo, podemos asumir que fue hecho por el sistema
      // o podríamos obtener el usuario actual del token si está disponible
      const creadorId = req.userId || null; // req.userId estaría disponible si hay un middleware de autenticación
      
      await registrarActividad(
        'creacion',
        `Se ha registrado un nuevo usuario: ${username}`,
        'usuario',
        user.id,
        creadorId,
        { email }
      );
    } catch (err) {
      console.error("Error al registrar actividad de registro:", err);
      // No interrumpimos el flujo de registro si falla el registro de actividad
    }
    
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ 
      where: { username },
      include: { model: Role, as: "roles" }
    });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "Invalid Password!" });    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });
    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);    // Registrar la actividad de inicio de sesión
    try {
      console.log("Registrando actividad de login para usuario:", {
        userId: user.id,
        username: user.username
      });
      
      await registrarActividad(
        'login', 
        `El usuario ${username} ha iniciado sesión`, 
        'usuario', 
        user.id, 
        user.id,
        { ip: req.ip, userAgent: req.headers['user-agent'] }
      );
    } catch (err) {
      console.error("Error al registrar actividad de login:", err);
      // No interrumpimos el flujo de inicio de sesión si falla el registro de actividad
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};