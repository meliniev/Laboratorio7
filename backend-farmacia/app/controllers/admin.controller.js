import db from "../models/index.js";
import bcrypt from "bcryptjs";

const { user: User, role: Role } = db;

export const listUsers = async (req, res) => {
  try {
    console.log("Ejecutando listUsers en admin.controller.js");
    const users = await User.findAll({
      include: [{
        model: Role,
        as: "roles",
        through: { attributes: [] }
      }]
    });
    console.log("Usuarios encontrados:", users.length);
    res.json(users);
  } catch (err) {
    console.error("Error en listUsers:", err);
    res.status(500).json({ message: err.message });
  }
};

// Función para listar todos los roles disponibles
export const listRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Role,
        as: "roles",
        through: { attributes: [] }
      }]
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 8);
      user.password = hashedPassword;
    }

    await user.save();

    if (roles) {
      const foundRoles = await Role.findAll({
        where: { name: roles }
      });
      await user.setRoles(foundRoles);
    }

    const updatedUser = await User.findByPk(req.params.id, {
      include: [{
        model: Role,
        as: "roles",
        through: { attributes: [] }
      }]
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await user.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
