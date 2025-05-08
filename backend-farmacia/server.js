import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";
import farmaciaRoutes from "./app/routes/farmacia.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get("/", (req, res) =>
  res.json({ message: "API Farmacia con JWT Authentication." })
);

// Autenticación y rutas protegidas
app.use("/api/auth",   authRoutes);
app.use("/api/users",  userRoutes);
app.use("/api/farmacia", farmaciaRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize
  .sync({ force: false })  // force: true para drop/create tablas
  .then(() => {
    console.log("✅ BD sincronizada.");
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}.`));
  })
  .catch(err => console.error("❌ Error al sincronizar BD:", err));
