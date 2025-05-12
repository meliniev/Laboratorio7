# 🚀 Guía de Despliegue en Render

Esta guía te ayudará a desplegar tu aplicación completa de farmacia en Render, incluyendo el backend, la base de datos PostgreSQL y el frontend.

## 📋 Requisitos Previos

- Una cuenta en [Render](https://render.com/)
- Tu código subido a un repositorio de GitHub
- Estructura de monorepo con carpetas separadas para backend y frontend

## 🌟 Paso 1: Crear la Base de Datos PostgreSQL

1. Accede a tu Dashboard de Render
2. Haz clic en **New** → **PostgreSQL**
3. Completa los siguientes campos:
   - **Name**: `bd-farmacia-postgres`
   - **Database**: `bd_farmacia` (Nota: Render creará un nombre diferente para la base de datos)
   - **User**: se generará automáticamente
   - **Region**: selecciona la más cercana a tus usuarios
   - **Instance Type**: Free (o el plan que prefieras)
4. Haz clic en **Create Database**
5. Render creará tu base de datos y mostrará la información de conexión

⚠️ **Guarda esta información** ya que la necesitarás para configurar tu backend

> ⚠️ **IMPORTANTE**: Render asigna un nombre propio a la base de datos que es diferente al que indicaste. Debes usar ese nombre en la configuración. Lo puedes encontrar en la sección "Connections" dentro de los detalles de tu base de datos.

## 🔧 Paso 2: Desplegar el Backend

1. En tu Dashboard de Render, haz clic en **New** → **Web Service**
2. Conecta con tu repositorio de GitHub
3. Configura el servicio:
   - **Name**: `backend-farmacia`
   - **Runtime**: Node
   - **Branch**: main
   - **Region**: selecciona la misma región que tu base de datos
   - **Root Directory**: `backend-farmacia`   - **Build Command**: `npm install pg pg-hstore && npm install` (Render añadirá automáticamente el prefijo `backend-farmacia/`)
   - **Start Command**: `node server.js` (Render añadirá automáticamente el prefijo `backend-farmacia/`)
   - **Instance Type**: Free
4. En la sección **Environment Variables**, haz clic en el botón **Add from .env** y pega el siguiente contenido:
   ```
   # IMPORTANTE: Usa el nombre exacto de la base de datos que genera Render, no bd_farmacia
   DB_NAME=nombre_correcto_de_la_base_de_datos_en_render
   DB_USER=usuario_generado_por_render
   DB_PASSWORD=contraseña_generada_por_render
   DB_HOST=host_de_postgres_render
   DB_PORT=5432
   DB_DIALECT=postgres
   DB_SSL=true
   JWT_SECRET=una_clave_segura_para_tus_tokens
   CORS_ORIGIN=https://app-farmacia.onrender.com
   PORT=10000
   RENDER=true
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@farmacia.com
   ADMIN_PASSWORD=una_contraseña_segura
   ```
   > ⚠️ Reemplaza los valores (usuario, contraseña, host) con los proporcionados por Render en tu base de datos PostgreSQL.
   - `ADMIN_EMAIL`: admin@farmacia.com
   - `ADMIN_PASSWORD`: una contraseña segura para el admin
5. Haz clic en **Create Web Service**

## 🖥️ Paso 3: Desplegar el Frontend

1. En tu Dashboard de Render, haz clic en **New** → **Static Site**
2. Conecta con tu repositorio de GitHub
3. Configura el servicio:
   - **Name**: `app-farmacia`
   - **Branch**: main
   - **Region**: selecciona la misma región que tu backend
   - **Root Directory**: `frontend-farmacia`
   - **Build Command**: `npm install && npm run build` (Render añadirá automáticamente el prefijo `frontend-farmacia/`)
   - **Publish Directory**: `build`
4. En la sección **Environment Variables**, haz clic en el botón **Add from .env** y pega:
   ```
   REACT_APP_API_URL=https://backend-farmacia.onrender.com/api
   ```   > ⚠️ Reemplaza la URL con la URL real de tu backend en Render, pero siempre agregar el "/api".
5. Haz clic en **Create Static Site**

## 📦 Notas Importantes sobre Dependencias

**Para evitar el error "Please install pg package manually"**:

1. El proyecto está configurado para instalar automáticamente las dependencias de PostgreSQL:
   - El archivo `server.js` ahora verifica e instala pg y pg-hstore automáticamente si no están disponibles
   - El script `check-dependencies.js` proporciona verificación adicional
   - El comando `prestart` en package.json ejecuta la verificación antes de iniciar la aplicación

2. Si aún encuentras el error en Render, puedes:
   - Ir a tu servicio → **Settings** → **Build & Deploy**
   - Actualizar el Build Command a uno de estos:
     ```
     npm install pg pg-hstore --no-save && npm install
     ```
     o
     ```
     npm install pg pg-hstore --no-save && npm ci
     ```
   - Reiniciar manualmente el servicio después de guardar los cambios

3. También puedes intentar:
   - Borrar la caché de compilación en Render: **Clear Build Cache**
   - Desplegar de nuevo con la opción **Manual Deploy** → **Deploy Latest Commit**

## 🔍 Solución de Problemas

Si encuentras algún problema durante el despliegue:

1. **Error "Please install pg package manually"**: 
   - Verifica que el Build Command incluya `npm install pg pg-hstore && npm install`
   - O modifica el servicio en Render: ve a tu servicio → **Settings** → **Build & Deploy** → actualiza el Build Command
   
2. **Error de conexión a la base de datos**: 
   - Verifica que las variables de entorno de conexión sean correctas
   - **Error `database "bd_farmacia" does not exist`**: Este error ocurre porque Render crea su propia base de datos. Debes usar el nombre de base de datos que proporciona Render, no "bd_farmacia". Revisa la sección "External Database URL" en los detalles de tu base de datos en Render y actualiza la variable `DB_NAME`.
   - Asegúrate de que la base de datos PostgreSQL esté en la misma región que tu servicio
   - Comprueba que el formato de la URL de conexión sea correcto

3. **CORS error**: 
   - Verifica que la variable `CORS_ORIGIN` en el backend coincida exactamente con la URL de tu frontend
   - Recuerda que debe incluir el protocolo (https://) y no debe tener una barra al final

4. **Error 404 en el frontend**: 
   - Asegúrate de que la aplicación React esté configurada para manejar rutas en Render
   - Verifica que el archivo `_redirects` esté correctamente configurado en la carpeta `public`
   - Comprueba la configuración de React Router

## ✅ Paso 4: Verificar el Despliegue

1. Espera a que todos los servicios terminen de desplegarse
2. Comprueba que el backend está funcionando visitando: 
   - `https://backend-farmacia.onrender.com/`
   - Deberías ver el mensaje: "API Farmacia con JWT Authentication."
3. Accede a tu frontend en:
   - `https://app-farmacia.onrender.com/`
4. Inicia sesión con el usuario administrador creado en las variables de entorno

## 📈 Escalado y Monitorización

Render proporciona herramientas para monitorear el rendimiento de tu aplicación:

1. Ve a tu servicio de backend -> **Metrics** para ver el uso de CPU, memoria y red
2. Configura alertas en **Alerts** para recibir notificaciones de problemas
3. Si necesitas más rendimiento, puedes actualizar tu plan en **Settings**

## 🧪 Verificación de la Base de Datos PostgreSQL

Si encuentras errores relacionados con la base de datos como `database "bd_farmacia" does not exist`, verifica que estás utilizando correctamente la información de PostgreSQL proporcionada por Render:

1. Ve a tu servicio de PostgreSQL en Render (bd-farmacia-postgres)
2. En la sección **Info**, encontrarás los siguientes datos importantes:
   - **Hostname**: Debe usarse como valor para `DB_HOST` 
   - **Port**: Debe ser 5432 (valor para `DB_PORT`)
   - **Database**: Este es el nombre REAL de la base de datos generado por Render (usar como `DB_NAME`)
   - **Username**: El usuario generado por Render (usar como `DB_USER`)
   - **Password**: La contraseña generada por Render (usar como `DB_PASSWORD`)
   - **Internal Database URL**: Contiene toda la información en formato de URL

3. Actualiza las variables de entorno en tu servicio backend con estos valores exactos
4. Recuerda que para PostgreSQL en Render debes establecer `DB_SSL=true`
5. Reinicia el servicio después de actualizar las variables de entorno
