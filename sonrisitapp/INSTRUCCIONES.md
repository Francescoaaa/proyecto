# 🚀 Instrucciones de Instalación - SonrisitApp

## 📋 Pasos para ejecutar el proyecto

### 1. Preparar el entorno

#### Instalar Node.js
1. Descargar Node.js desde: https://nodejs.org/
2. Instalar la versión LTS recomendada
3. Verificar instalación:
   ```bash
   node --version
   npm --version
   ```

#### Configurar XAMPP
1. Iniciar XAMPP Control Panel
2. Activar **Apache** y **MySQL**
3. Verificar que MySQL esté ejecutándose en puerto 3306

### 2. Configurar la Base de Datos

1. **Abrir phpMyAdmin:**
   - Ir a: http://localhost/phpmyadmin/
   
2. **Crear la base de datos:**
   - Hacer clic en "Nueva" en el panel izquierdo
   - Nombre: `sonrisitapp`
   - Cotejamiento: `utf8_general_ci`
   - Hacer clic en "Crear"

3. **Importar estructura:**
   - Seleccionar la base de datos `sonrisitapp`
   - Ir a la pestaña "SQL"
   - Copiar y pegar el contenido del archivo `backend/database/database.sql`
   - Hacer clic en "Continuar"

### 3. Configurar el Backend

1. **Abrir terminal en la carpeta del backend:**
   ```bash
   cd "c:\xampp\htdocs\proyecto fede\sonrisitapp\backend"
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Verificar archivo .env:**
   - Asegurarse de que existe el archivo `.env`
   - Verificar que las credenciales de MySQL sean correctas:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=sonrisitapp
     JWT_SECRET=sonrisitapp_secret_key_2025
     PORT=3001
     ```

4. **Iniciar el servidor backend:**
   ```bash
   npm start
   ```
   
   O para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

5. **Verificar que funciona:**
   - Abrir navegador en: http://localhost:3001
   - Debería mostrar: "SonrisitApp API funcionando correctamente"
   - Documentación Swagger: http://localhost:3001/api-docs

### 4. Configurar el Frontend

1. **Abrir nueva terminal en la carpeta del frontend:**
   ```bash
   cd "c:\xampp\htdocs\proyecto fede\sonrisitapp\frontend"
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación React:**
   ```bash
   npm start
   ```

4. **Verificar que funciona:**
   - Se abrirá automáticamente: http://localhost:3000
   - Debería mostrar la página de login de SonrisitApp

### 5. Probar la Aplicación

#### Usuario Administrador (ya creado)
- **Email:** admin@sonrisitapp.com
- **Contraseña:** password

#### Crear nuevo usuario
1. Hacer clic en "Registrarse"
2. Completar el formulario
3. Iniciar sesión con las credenciales creadas

#### Funcionalidades a probar
1. **Registro de usuario**
2. **Inicio de sesión**
3. **Reservar turno**
4. **Ver mis turnos**
5. **Cancelar turno**
6. **Panel de administración** (solo admin)

### 6. Solución de Problemas Comunes

#### Error de conexión a MySQL
- Verificar que XAMPP MySQL esté ejecutándose
- Comprobar credenciales en `.env`
- Verificar que la base de datos `sonrisitapp` existe

#### Error "Cannot find module"
```bash
# En la carpeta correspondiente
npm install
```

#### Puerto ocupado
- Backend (3001): Cambiar PORT en `.env`
- Frontend (3000): Se asignará automáticamente otro puerto

#### Error CORS
- Verificar que el backend esté ejecutándose en puerto 3001
- Comprobar configuración de CORS en `server.js`

### 7. Estructura de URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Documentación:** http://localhost:3001/api-docs
- **phpMyAdmin:** http://localhost/phpmyadmin/

### 8. Comandos Útiles

```bash
# Backend
cd backend
npm install          # Instalar dependencias
npm start           # Iniciar servidor
npm run dev         # Iniciar con nodemon

# Frontend  
cd frontend
npm install          # Instalar dependencias
npm start           # Iniciar aplicación React
npm run build       # Crear build de producción
```

### 9. Archivos Importantes

- `backend/.env` - Configuración de variables de entorno
- `backend/database/database.sql` - Script de base de datos
- `backend/server.js` - Servidor principal
- `frontend/src/services/api.js` - Configuración de API
- `frontend/src/App.js` - Componente principal React

¡Listo! La aplicación debería estar funcionando correctamente. 🎉