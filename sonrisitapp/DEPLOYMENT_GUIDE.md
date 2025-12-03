# 🚀 Guía de Despliegue - SonrisitApp

## 📋 Información del Proyecto

**Proyecto:** SonrisitApp - Sistema de Gestión de Turnos Odontológicos  
**Desarrollado por:** [Tu Nombre] - Proyecto Individual  
**Tecnologías:** React + Node.js + Express + MySQL  

## 🔗 Enlaces del Proyecto

### 🌐 Proyecto Desplegado
- **Frontend:** https://sonrisitapp-frontend.onrender.com
- **Backend API:** https://sonrisitapp-backend.onrender.com
- **Documentación API:** https://sonrisitapp-backend.onrender.com/api-docs

### 📂 Repositorio GitHub
- **Repositorio:** https://github.com/[tu-usuario]/sonrisitapp
- **Rama principal:** main

## 👥 Información del Grupo

**Trabajo Individual:**
- Desarrollador: [Tu Nombre Completo]
- Email: [tu-email@ejemplo.com]
- Legajo: [Tu Legajo]

*Nota: Este proyecto fue desarrollado de forma individual como parte del Proyecto Integrador 2025.*

## 🛠️ Pasos para Desplegar en Render

### 1. Preparar el Repositorio GitHub

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit - SonrisitApp"

# Conectar con GitHub
git remote add origin https://github.com/[tu-usuario]/sonrisitapp.git

# Subir código
git push -u origin main
```

### 2. Configurar Base de Datos en Render

1. Ir a [Render Dashboard](https://dashboard.render.com)
2. Crear nuevo **PostgreSQL Database**
3. Nombre: `sonrisitapp-db`
4. Copiar credenciales de conexión

### 3. Desplegar Backend

1. En Render, crear nuevo **Web Service**
2. Conectar repositorio GitHub
3. Configuración:
   - **Name:** `sonrisitapp-backend`
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free

4. Variables de entorno:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=[host de render]
   DB_USER=[usuario de render]
   DB_PASSWORD=[password de render]
   DB_NAME=sonrisitapp
   JWT_SECRET=[generar secreto aleatorio]
   ```

### 4. Desplegar Frontend

1. Crear nuevo **Static Site**
2. Configuración:
   - **Name:** `sonrisitapp-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/build`

### 5. Configurar Base de Datos

Ejecutar el script SQL en la base de datos de Render:
```sql
-- Copiar contenido de backend/database.sql
```

## 🔧 Configuración Local para Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/[tu-usuario]/sonrisitapp.git
cd sonrisitapp

# Instalar dependencias
npm run install-all

# Configurar variables de entorno
cp backend/.env.example backend/.env

# Iniciar desarrollo
npm run dev
```

## 📱 Credenciales de Prueba

### Administrador
- **Email:** admin@sonrisitapp.com
- **Contraseña:** password

### Usuario de Prueba
- **Email:** ana.garcia@email.com
- **Contraseña:** password

## 🎯 Funcionalidades Implementadas

- ✅ Sistema de autenticación JWT
- ✅ Registro y login de usuarios
- ✅ Reserva de turnos con calendario
- ✅ Panel de administración
- ✅ Gestión de servicios odontológicos
- ✅ Sistema de notificaciones
- ✅ API REST documentada con Swagger
- ✅ Diseño responsive
- ✅ Base de datos MySQL/PostgreSQL

## 📊 Arquitectura del Proyecto

```
SonrisitApp/
├── frontend/          # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── backend/           # Node.js API
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   └── server.js
├── database.sql       # Estructura de BD
└── README.md
```

## 🔍 Monitoreo y Logs

- **Render Logs:** Dashboard > Service > Logs
- **Health Check:** https://sonrisitapp-backend.onrender.com/health
- **API Status:** https://sonrisitapp-backend.onrender.com/

## 📞 Soporte

Para consultas sobre el proyecto:
- **Email:** [tu-email@ejemplo.com]
- **GitHub Issues:** https://github.com/[tu-usuario]/sonrisitapp/issues

---

**Desarrollado con ❤️ para el Proyecto Integrador 2025**