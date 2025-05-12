import bcrypt from 'bcryptjs';
import db from './app/models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const { user: User } = db;

/**
 * Script para encriptar contraseñas de usuarios existentes que no están hasheadas
 * Útil cuando se migra una base de datos con contraseñas en texto plano
 */
const encryptPasswords = async () => {
  try {
    // Sincronizar base de datos sin recrear tablas
    await db.sequelize.sync({ force: false });
    console.log("Base de datos sincronizada");

    // Obtener todos los usuarios
    const users = await User.findAll();
    console.log(`Procesando ${users.length} usuarios...`);

    let count = 0;
    for (const user of users) {
      // Verificar si la contraseña ya está hasheada (las contraseñas bcrypt comienzan con $2a$, $2b$ o $2y$)
      if (!user.password.startsWith('$2')) {
        const hashedPassword = await bcrypt.hash(user.password, 8);
        await user.update({ password: hashedPassword });
        count++;
      }
    }

    console.log(`✅ ${count} contraseñas encriptadas exitosamente.`);
  } catch (error) {
    console.error('❌ Error durante la encriptación:', error);
  } finally {
    await db.sequelize.close();
  }
};

// Si el script se ejecuta directamente
if (process.argv[1] === new URL(import.meta.url).pathname) {
  encryptPasswords().then(() => {
    console.log('Proceso completado');
    process.exit(0);
  });
}

export default encryptPasswords;
