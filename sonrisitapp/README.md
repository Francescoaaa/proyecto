# 🦷 SonrisitApp - Sistema de Gestión de Turnos Odontológicos

## 📋 Descripción
SonrisitApp es una aplicación web full stack para la gestión de turnos odontológicos que permite a los usuarios reservar, modificar y cancelar citas médicas de manera eficiente.

## 📝 Resumen Ejecutivo

### ¿Qué se desarrolló?
Una aplicación web completa para consultorio odontológico con sistema de turnos online, autenticación de usuarios y panel administrativo.

### Arquitectura Técnica
- **Frontend:** React 18 con Bootstrap para interfaz moderna y responsive
- **Backend:** API REST con Node.js/Express y autenticación JWT
- **Base de datos:** MySQL con estructura relacional para usuarios y turnos
- **Seguridad:** Encriptación bcrypt, validaciones y protección de rutas

### Funcionalidades Implementadas
- **Sistema de usuarios:** Registro, login y gestión de sesiones
- **Gestión de turnos:** Reserva, visualización, modificación y cancelación
- **Panel administrativo:** Control total de turnos y usuarios
- **API documentada:** Swagger para testing y documentación
- **Diseño responsive:** Optimizado para móviles, tablets y desktop

### Flujo de la aplicación
1. **Pacientes:** Se registran → Reservan turnos → Gestionan sus citas
2. **Administradores:** Acceden al panel → Gestionan todos los turnos → Cambian estados
3. **Sistema:** Valida datos → Autentica usuarios → Sincroniza en tiempo real

### Tecnologías clave utilizadas
- **Desarrollo:** React + Node.js + Express + MySQL
- **Autenticación:** JWT tokens con bcrypt
- **Documentación:** Swagger UI
- **Herramientas:** XAMPP para desarrollo local

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** con Express.js
- **MySQL** como base de datos
- **JWT** para autenticación
- **Swagger** para documentación de API
- **bcryptjs** para encriptación de contraseñas

### Frontend
- **React** 18
- **React Router** para navegación
- **Bootstrap** 5 para diseño responsive
- **Fetch API** para consumo de servicios

## 📁 Estructura del Proyecto

```
sonrisitapp/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   └── turnoController.js
│   ├── routes/
│   │   ├── usuarios.js
│   │   └── turnos.js
│   ├── database/
│   │   └── database.sql
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Registro.js
    │   │   ├── Reservar.js
    │   │   ├── MisTurnos.js
    │   │   └── Admin.js
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   └── App.css
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── README.md
```

## 🚀 Scripts de Instalación Rápida

### Para usuarios nuevos:
1. **`DIAGNOSE_ISSUES.bat`** - Diagnostica problemas del proyecto
2. **`INSTALL_DEPENDENCIES.bat`** - Instala todas las dependencias automáticamente
3. **`SETUP_DATABASE.bat`** - Guía para configurar la base de datos
4. **`CLEANUP_PROJECT.bat`** - Limpia archivos duplicados y temporales

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL Server
- XAMPP (recomendado para desarrollo local)

### Configuración del Backend

1. **Navegar al directorio del backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar base de datos:**
   - Iniciar XAMPP y activar MySQL
   - Importar el archivo `database/database.sql` en phpMyAdmin
   - Verificar configuración en `.env`

4. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

### Configuración del Frontend

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar aplicación:**
   ```bash
   npm start
   ```

## 🔗 Endpoints de la API

### Usuarios
- `POST /usuarios` - Crear usuario
- `POST /login` - Iniciar sesión

### Turnos
- `GET /turnos` - Listar turnos
- `POST /turnos` - Crear turno
- `PUT /turnos/:id` - Modificar turno
- `DELETE /turnos/:id` - Cancelar turno
- `GET /turnos/mis-turnos/:usuario_id` - Turnos de usuario

## 📖 Documentación API
La documentación completa de la API está disponible en:
`http://localhost:3001/api-docs`

## 👥 Usuarios de Prueba

### Administrador
- **Email:** admin@sonrisitapp.com
- **Contraseña:** password

## 🎯 Funcionalidades

### Para Usuarios
- ✅ Registro e inicio de sesión
- ✅ Reservar turnos disponibles
- ✅ Ver mis turnos reservados
- ✅ Cancelar turnos
- ✅ Selección de servicios odontológicos

### Para Administradores
- ✅ Panel de administración
- ✅ Gestión completa de turnos
- ✅ Cambio de estados (reservado/completado/cancelado)
- ✅ Vista de todos los usuarios y turnos

## 🔒 Seguridad
- Contraseñas encriptadas con bcrypt
- Autenticación JWT
- Validación de datos en frontend y backend
- Protección de rutas sensibles

## 📱 Diseño Responsive
La aplicación está optimizada para:
- 💻 Desktop
- 📱 Tablets
- 📱 Móviles

## 🚀 Despliegue
Para producción, configurar:
1. Variables de entorno de producción
2. Base de datos MySQL en servidor
3. Build del frontend: `npm run build`
4. Servidor Node.js en producción

## 👨‍💻 Desarrollo
Proyecto desarrollado como parte del Proyecto Integrador 2025 - Aplicación Web Full Stack.

## 📄 Licencia
Este proyecto es de uso académico.
### Estado del proyecto
- ✅ **Backend completo:** API REST funcional con todos los endpoints
- ✅ **Frontend completo:** Interfaz de usuario responsive y moderna
- ✅ **Base de datos:** Estructura optimizada y poblada con datos de prueba
- ✅ **Autenticación:** Sistema seguro de login y registro
- ✅ **Documentación:** API documentada y README completo
- ✅ **Testing:** Endpoints probados y funcionales