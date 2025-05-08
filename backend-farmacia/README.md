# Para instalar la aplicación Backend, sigue los siguientes pasos:

# 1. Cambiar al directorio `backend`:

#    cd app-farmacia/backend

# 2. Instalar dependencias:

#    npm install

# 3. Configuración de Base de Datos:

# Para configurar la base de datos, crea un archivo `.env` en el directorio raíz con la siguiente información:
DB_NAME=bd_farmacia
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_DIALECT=mysql
JWT_SECRET=tu_clave_secreta_jwt
CORS_ORIGIN=http://localhost:3000
PORT=3000

# Migraciones (opcional para desarrollo)

#    npx sequelize-cli db:migrate

# ==============================

# 4. Iniciar la aplicación:

#    npm start

# 5. Insertar datos iniciales

mysql -u tu_usuario -p

USE bd_farmacia;

INSERT INTO Roles (id, name, createdAt, updatedAt) VALUES
  (1, 'user',      NOW(), NOW()),
  (2, 'moderator', NOW(), NOW()),
  (3, 'admin',     NOW(), NOW());

EXIT;
