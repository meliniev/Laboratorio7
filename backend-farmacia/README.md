# 🏥 Backend App Farmacia - Guía de Instalación

## 🔧 Instalación y Configuración

### 1. Acceder al directorio del proyecto:
```bash
cd app-farmacia/backend
```

### 2. Instalar dependencias:
```bash
npm install
```

### 3. Configurar variables de entorno:
Crea un archivo `.env` en la raíz del backend con el siguiente contenido:
```env
DB_NAME=bd_farmacia
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_DIALECT=mysql
JWT_SECRET=tu_clave_secreta_jwt
CORS_ORIGIN=http://localhost:3000
PORT=3000
```

### 4. Ejecutar migraciones (opcional para desarrollo):
```bash
npx sequelize-cli db:migrate
```

### 5. Iniciar la aplicación:
```bash
npm start
```

### 6. Poblar datos iniciales (Roles):
```bash
mysql -u tu_usuario -p -e "USE bd_farmacia; INSERT INTO Roles (id, name, createdAt, updatedAt) VALUES (1, 'user', NOW(), NOW()), (2, 'moderator', NOW(), NOW()), (3, 'admin', NOW(), NOW());"
```
