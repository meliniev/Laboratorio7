import db from "../models/index.js";

const { role: Role, user: User } = db;

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userByUsername = await User.findOne({ where: { username: req.body.username } });
    if (userByUsername) return res.status(400).json({ message: "Username already exists!" });

    const userByEmail = await User.findOne({ where: { email: req.body.email } });
    if (userByEmail) return res.status(400).json({ message: "Email already exists!" });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    const validRoles = ["admin", "moderator", "user"];
    const invalidRoles = req.body.roles.filter(role => !validRoles.includes(role));
    if (invalidRoles.length > 0) return res.status(400).json({ message: `Invalid roles: ${invalidRoles}` });
  }
  next();
};