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

### 5. Encriptar contraseñas de usuarios:
```bash
node encrypt_passwords.js
```
Este paso es necesario para que las contraseñas funcionen con el sistema de autenticación.

### 6. Credenciales de prueba:
| Usuario    | Contraseña | Rol       |
|------------|------------|-----------|
| admin      | admin      | Admin     |
| moderator  | moderator  | Moderador |
| user       | user       | Usuario   |

⚠️ **Importante**: 
- Por seguridad, cambia las contraseñas después de la primera conexión.
- En un entorno de producción, nunca uses contraseñas tan simples.
- El script de encriptación solo debe ejecutarse una vez después de crear los usuarios.

### 7. Iniciar la aplicación:
```bash
npm start
```

