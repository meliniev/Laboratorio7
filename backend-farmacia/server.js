import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";
import adminRoutes from "./app/routes/admin.routes.js";
import farmaciaRoutes from "./app/routes/farmacia.routes.js";
import actividadRoutes from "./app/routes/actividad.routes.js";
import dotenv from "dotenv";
import initialize from "./init.js";

dotenv.config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || ["http://localhost:3000", "https://farmacia-frontend.onrender.com"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get("/", (req, res) =>
  res.json({ message: "API Farmacia con JWT Authentication." })
);

// Autenticación y rutas protegidas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmacia", farmaciaRoutes);
app.use("/api/actividades", actividadRoutes);

const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    // Si estamos en Render o es la primera ejecución
    if (process.env.RENDER || process.env.INIT_DB) {
      await initialize();
    }

    // Sincronizar base de datos sin recrear tablas
    await db.sequelize.sync({ force: false });
    console.log("✅ BD sincronizada.");
    
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}.`));
  } catch (err) {
    console.error("❌ Error al iniciar servidor:", err);
  }
};

startServer();
