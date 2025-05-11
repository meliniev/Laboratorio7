# 💾 README - Base de Datos y Migraciones

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ Node.js v18 o superior
- ✅ MySQL Server v8 o superior

## 🛠️ Crear Base de Datos

Para crear la base de datos `bd_farmacia` en MySQL Server, sigue los siguientes pasos:

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
