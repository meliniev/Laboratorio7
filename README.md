# 💾 README - Base de Datos y Migraciones

## 📋 Estructura del Proyecto

Este proyecto sigue una estructura de monorepo con los siguientes componentes:

```
app-farmacia/
├── backend-farmacia/    # API REST con Express y Sequelize
├── frontend-farmacia/   # Aplicación React para la interfaz de usuario
└── README.md            # Este archivo
```

Para el despliegue en Render, es importante especificar el directorio raíz correspondiente a cada servicio.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ Node.js v18 o superior
- ✅ MySQL Server v8 o superior

## 🛠️ Configuración Local

Para crear la base de datos `bd_farmacia` en MySQL Server local, sigue los siguientes pasos:

### 1. Acceder a la línea de comandos de MySQL:
```bash
mysql -u tu_usuario -p
```

### 2. Crear la base de datos:
```sql
CREATE DATABASE bd_farmacia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bd_farmacia;
```

### 3. Poblar datos iniciales (Roles):
```sql
INSERT INTO Roles (id, name, createdAt, updatedAt) 
VALUES 
(1, 'user', NOW(), NOW()),
(2, 'moderator', NOW(), NOW()),
(3, 'admin', NOW(), NOW());
```

### 4. Crear usuarios de prueba:
```sql
-- Crear usuarios iniciales
INSERT INTO users (username, email, password, createdAt, updatedAt) 
VALUES 
('admin', 'admin@farmacia.com', 'admin', NOW(), NOW()),
('moderator', 'moderator@farmacia.com', 'moderator', NOW(), NOW()),
('user', 'user@farmacia.com', 'user', NOW(), NOW());

-- Asignar roles a los usuarios
INSERT INTO user_roles (userId, roleId, createdAt, updatedAt) 
VALUES 
(1, 3, NOW(), NOW()),  -- admin tiene rol de admin
(2, 2, NOW(), NOW()),  -- moderator tiene rol de moderador
(3, 1, NOW(), NOW());  -- user tiene rol de usuario normal
```

### 5. Salir:
```sql
EXIT;
```

⚠️ **Importante**: 
Para completar la configuración de los usuarios, consulta las instrucciones adicionales en el README del backend.

## 🚀 Configuración en Render

Para desplegar la base de datos en Render, sigue estos pasos:

### 1. Crear una base de datos PostgreSQL:

1. Ve a la sección **Database** de Render
2. Haz clic en **New PostgreSQL**
3. Completa la siguiente información:
   - **Name**: `bd_farmacia` (o el nombre que prefieras)
   - **Database**: _Dejar el valor por defecto_
   - **User**: _Dejar el valor por defecto_
   - **PostgreSQL Version**: 16
   - **Instance Type**: Free (Para pruebas)

4. Haz clic en **Create Database**

### 2. Guarda la información de conexión:

Una vez creada la base de datos, Render mostrará la siguiente información crucial:
- **Hostname**: Por ejemplo, `dpg-d0giuaa4d50c73ft6f40-a`
- **Port**: 5432
- **Database**: El nombre de la base de datos
- **Username**: Usuario generado
- **Password**: Contraseña generada
- **Internal Database URL**: URL completa para conexión interna
- **External Database URL**: URL completa para conexión externa

⚠️ **IMPORTANTE**: Guarda esta información cuidadosamente ya que la necesitarás para configurar el backend.

### 3. Migrar el esquema:

Como estamos usando PostgreSQL en lugar de MySQL en Render, debemos modificar nuestro backend para que sea compatible. Consulta el README del backend para más detalles sobre la configuración necesaria.

⚠️ **Nota sobre expiración**: Las bases de datos gratuitas en Render expiran después de 90 días.

## 📊 Despliegue

Para instrucciones detalladas sobre cómo desplegar esta aplicación en Render, consulta el archivo [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

Este archivo contiene:
- Pasos para crear la base de datos PostgreSQL en Render
- Configuración del backend como Web Service
- Despliegue del frontend como Static Site
- Solución de problemas comunes
