# 🏥 Frontend App Farmacia

## 🔧 Instalación y Configuración Local

### 1. Acceder al directorio del proyecto:
```bash
cd app-farmacia/frontend-farmacia
```

### 2. Instalar dependencias:
```bash
npm install
```

### 3. Configurar variables de entorno:
Crea un archivo `.env` en la raíz del frontend con el siguiente contenido:
```env
REACT_APP_API_URL=http://localhost:1000/api
```

### 4. Iniciar la aplicación en modo desarrollo:
```bash
npm start
```

### 5. Construir la aplicación para producción:
```bash
npm run build
```

## 🚀 Despliegue en Render

### 1. Preparar el proyecto para producción

Asegúrate de que tu aplicación esté lista para producción:

1. Construye la aplicación:
```bash
npm run build
```

2. Verifica que la carpeta `build` se haya creado correctamente.

### 2. Crear el Static Site en Render

1. Accede a tu cuenta de Render
2. Ve a **Dashboard** y selecciona **New Static Site**
3. Conecta con tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: `app-farmacia`
   - **Branch**: main
   - **Region**: selecciona la misma región que tu backend
   - **Root Directory**: `frontend-farmacia` (¡Importante en estructura de monorepo!)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### 3. Configurar variables de entorno

En la sección **Environment Variables** de Render, haz clic en **Add from .env** y pega:

```
REACT_APP_API_URL=https://backend-farmacia.onrender.com/api
```

⚠️ **Importante**: Reemplaza la URL con la de tu backend desplegado en Render.

### 4. Iniciar despliegue

Haz clic en **Create Static Site** para iniciar el despliegue.

### 5. Verificar despliegue

Una vez que el despliegue haya finalizado, podrás acceder a tu aplicación en la URL proporcionada por Render:
```
https://app-farmacia.onrender.com
```

### 6. Problemas comunes y soluciones

1. **Rutas**: La aplicación React necesita configurarse para manejar rutas correctamente. Asegúrate de que estás usando `BrowserRouter` en tu aplicación.

2. **CORS**: Si tienes problemas de CORS, verifica que el backend tenga configurado correctamente los orígenes permitidos.

3. **Variables de entorno**: Recuerda que en React, las variables de entorno deben comenzar con `REACT_APP_` para ser accesibles desde la aplicación.
