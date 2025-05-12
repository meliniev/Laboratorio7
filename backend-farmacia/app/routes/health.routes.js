import express from 'express';
import db from '../models/index.js';

const router = express.Router();

/**
 * Middleware para verificar la conexión con la base de datos
 */
const checkDbConnection = async (req, res, next) => {
  try {
    await db.sequelize.authenticate();
    req.dbStatus = 'connected';
    next();
  } catch (error) {
    req.dbStatus = 'disconnected';
    req.dbError = error.message;
    next();
  }
};

/**
 * Ruta de health check
 */
router.get('/health', checkDbConnection, (req, res) => {
  const status = {
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: {
      status: req.dbStatus,
      ...(req.dbError && { error: req.dbError }),
      dialect: process.env.DB_DIALECT || 'mysql'
    },
    environment: process.env.NODE_ENV || 'development',
    memoryUsage: process.memoryUsage(),
  };

  if (req.dbStatus === 'disconnected') {
    return res.status(500).json({
      ...status,
      status: 'error',
      message: 'Database connection failed'
    });
  }

  return res.status(200).json(status);
});

export default router;
