import db from './app/models/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { user: User, role: Role } = db;

const initialize = async () => {
  try {
    // Sincronizar la base de datos
    await db.sequelize.sync({ force: true }); // En producción, considera usar force: false
    console.log('Base de datos sincronizada');

    // Crear roles
    await Role.bulkCreate([
      { name: 'user' },
      { name: 'moderator' },
      { name: 'admin' }
    ]);
    console.log('Roles creados');

    // Crear usuario admin por defecto
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', 8);
    const admin = await User.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@farmacia.com',
      password: hashedPassword
    });
    
    // Asignar rol de admin
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    await admin.addRole(adminRole);
    
    console.log('Usuario administrador creado');

    if (process.env.NODE_ENV === 'development') {
      // Crear usuarios adicionales solo en desarrollo
      const users = [
        { username: 'moderator', email: 'moderator@farmacia.com', role: 'moderator' },
        { username: 'user', email: 'user@farmacia.com', role: 'user' }
      ];

      for (const userData of users) {
        const user = await User.create({
          username: userData.username,
          email: userData.email,
          password: await bcrypt.hash(userData.username, 8)
        });
        const role = await Role.findOne({ where: { name: userData.role } });
        await user.addRole(role);
      }
      console.log('Usuarios de prueba creados');
    }

  } catch (error) {
    console.error('Error durante la inicialización:', error);
  }
};

// Si el script se ejecuta directamente
if (process.argv[1] === new URL(import.meta.url).pathname) {
  initialize().then(() => {
    console.log('Inicialización completada');
    process.exit(0);
  });
}

export default initialize;
