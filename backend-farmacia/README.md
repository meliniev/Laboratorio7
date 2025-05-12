# 🏥 Backend App Farmacia - Guía de Instalación

## 🔧 Instalación y Configuración Local

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

### 8. Adaptación para PostgreSQL (Render)

El backend está configurado para funcionar tanto con MySQL (desarrollo local) como con PostgreSQL (Render):

1. Soporte para opciones SSL en entornos de producción:
   ```javascript
   // Configuración en db.config.js
   ...(process.env.DB_SSL === 'true' && {
     dialectOptions: {
       ssl: {
         require: true,
         rejectUnauthorized: false
       }
     }
   })
   ```

2. Variables de entorno para cambiar fácilmente entre MySQL y PostgreSQL

## 🚀 Despliegue en Render

### 1. Preparación para el despliegue

Asegúrate de tener en cuenta lo siguiente antes de desplegar:

1. El proyecto tiene `"type": "module"` configurado en package.json para usar módulos ES
2. La aplicación está preparada para usar tanto MySQL localmente como PostgreSQL en Render
3. Se incluye un script de inicialización (`init.js`) que configura la base de datos

### 2. Crear el Web Service en Render

1. Accede a tu cuenta de Render
2. Ve a **Dashboard** y selecciona **New Web Service**
3. Conecta con tu repositorio de GitHub
4. Configura el servicio:   - **Name**: `backend-farmacia`
   - **Runtime**: Node
   - **Branch**: main
   - **Region**: selecciona una región cercana a tus usuarios
   - **Root Directory**: `backend-farmacia` (¡Importante en estructura de monorepo!)
   - **Build Command**: `npm install pg pg-hstore && npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free (para pruebas)

### 3. Configurar variables de entorno

En la sección **Environment Variables** de Render, haz clic en **Add from .env** y pega:

```
DB_NAME=bd_farmacia
DB_USER=usuario_generado_por_render
DB_PASSWORD=contraseña_generada_por_render
DB_HOST=host_de_postgres_render
DB_PORT=5432
DB_DIALECT=postgres
DB_SSL=true
JWT_SECRET=una_clave_secreta_muy_segura
CORS_ORIGIN=https://app-farmacia.onrender.com
PORT=10000
RENDER=true
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@farmacia.com
ADMIN_PASSWORD=una_contraseña_segura
```

⚠️ **Importante**: Reemplaza los valores con la información de tu base de datos PostgreSQL en Render.

### 4. Modificaciones para PostgreSQL

Como Render solo ofrece PostgreSQL como servicio de base de datos gratuito, es necesario adaptar el backend para usar PostgreSQL en lugar de MySQL:

1. Instala las dependencias de PostgreSQL:
```bash
npm install pg pg-hstore
```

2. Modifica el archivo `db.config.js` para soportar PostgreSQL:
```javascript
export default {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "bd_farmacia",
  dialect: process.env.DB_DIALECT || "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  ...(process.env.DB_SSL === 'true' && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
};
```

### 5. Iniciar despliegue

Haz clic en **Create Web Service** para iniciar el despliegue.

### 6. Verificar despliegue

Una vez que el despliegue haya finalizado, podrás acceder a tu API en la URL proporcionada por Render:
```
https://backend-farmacia.onrender.com
```

### 7. Configuración de PostgreSQL en Render

1. En el Dashboard de Render, ve a **New PostgreSQL**
2. Configura la base de datos:
   - **Name**: `bd-farmacia-postgres`
   - **Database**: `bd_farmacia`
   - **User**: se generará automáticamente
   - **Instance Type**: Free (para pruebas)
3. Haz clic en **Create Database**
4. Una vez creada la base de datos, Render mostrará la información de conexión:
   - **Internal Database URL**: utiliza esta para configurar tu aplicación
   - **External Database URL**: para conectarse desde herramientas externas
   - **Hostname**: para la variable `DB_HOST`
   - **Port**: generalmente 5432, para la variable `DB_PORT`
   - **User**: para la variable `DB_USER`
   - **Password**: para la variable `DB_PASSWORD`
   - **Database**: para la variable `DB_NAME`

5. Actualiza las variables de entorno en el servicio Web con estos valores.

6. La base de datos se inicializará automáticamente durante el primer despliegue gracias al script `init.js`.

4. El script mostrará todas las variables de entorno formateadas listas para copiar y pegar en Render:
   ```
   DB_NAME=bd_farmacia
   DB_USER=usuario
   DB_PASSWORD=contraseña
   DB_HOST=host
   DB_PORT=5432
   DB_DIALECT=postgres
   DB_SSL=true
   ```

5. Puedes copiar estos valores directamente en la sección **Environment Variables** → **Add from .env**

