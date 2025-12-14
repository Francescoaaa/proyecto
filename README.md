# 🦷 SonrisitApp - Sistema de Gestión de Turnos Odontológicos

Sistema web completo para la gestión de turnos en consultorios odontológicos, desarrollado con React y Node.js.

## 📋 Descripción

SonrisitApp es una aplicación web que permite a los pacientes reservar turnos online y a los odontólogos gestionar su agenda de manera eficiente. Incluye sistema de autenticación, notificaciones y panel administrativo.

## 🚀 Características

- ✅ **Gestión de Turnos**: Reserva, modificación y cancelación
- ✅ **Sistema de Usuarios**: Pacientes, odontólogos y administradores
- ✅ **Autenticación JWT**: Login seguro con tokens
- ✅ **Notificaciones**: Sistema de alertas y recordatorios
- ✅ **Panel Admin**: Gestión completa del sistema
- ✅ **Responsive Design**: Adaptado a móviles y desktop
- ✅ **Base de Datos**: PostgreSQL con datos de ejemplo

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** (Base de datos)
- **JWT** (Autenticación)
- **bcrypt** (Encriptación)
- **CORS** (Cross-Origin Resource Sharing)

### Frontend
- **React 18**
- **React Router** (Navegación)
- **Tailwind CSS** (Estilos)
- **Material Symbols** (Iconos)

### Deployment
- **Backend**: Render.com
- **Frontend**: Vercel/Netlify
- **Base de Datos**: PostgreSQL en Render

## 📁 Estructura del Proyecto

```
proyecto/
├── sonrisitapp/
│   ├── backend/
│   │   ├── controllers/
│   │   │   ├── usuarioController.js
│   │   │   ├── turnoController.js
│   │   │   └── notificacionController.js
│   │   ├── routes/
│   │   │   ├── usuarios.js
│   │   │   ├── turnos.js
│   │   │   └── notificaciones.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── database.sql
│   │   ├── database-postgresql.sql
│   │   ├── server.js
│   │   └── package.json
│   └── frontend/
│       ├── public/
│       │   ├── index.html
│       │   └── _redirects
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   │   └── api.js
│       │   ├── App.js
│       │   └── index.js
│       ├── netlify.toml
│       └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Francescoaaa/proyecto.git
cd proyecto
```

### 2. Backend Setup
```bash
cd sonrisitapp/backend
npm install
```

**Variables de Entorno (.env):**
```env
PORT=3001
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=sonrisitapp
JWT_SECRET=tu_jwt_secret
```

### 3. Frontend Setup
```bash
cd sonrisitapp/frontend
npm install
```

### 4. Base de Datos
Ejecutar el archivo `database-postgresql.sql` en PostgreSQL:
```sql
-- Crear base de datos
CREATE DATABASE sonrisitapp;

-- Ejecutar el script completo
\i database-postgresql.sql
```

## 🚀 Ejecución

### Desarrollo Local
```bash
# Backend (Puerto 3001)
cd sonrisitapp/backend
npm start

# Frontend (Puerto 3000)
cd sonrisitapp/frontend
npm start
```

### Producción
- **Backend**: https://sonrisitapp-backend.onrender.com
- **Frontend**: https://tu-app.vercel.app

## 👥 Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@sonrisitapp.com | password |
| Usuario | ana.garcia@email.com | password |
| Usuario | luis.martinez@email.com | password |

## 📊 Base de Datos

### Tablas Principales
- **usuarios**: Información de pacientes y administradores
- **odontologos**: Datos de los profesionales
- **servicios**: Tipos de tratamientos disponibles
- **turnos**: Reservas y citas
- **notificaciones**: Sistema de alertas
- **historial_medico**: Registros médicos
- **horarios_atencion**: Disponibilidad de odontólogos

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:
- Login genera token válido por 24 horas
- Middleware de autenticación protege rutas sensibles
- Roles: `usuario`, `admin`, `odontologo`

## 📱 Funcionalidades por Rol

### Pacientes
- Registrarse y hacer login
- Reservar turnos disponibles
- Ver mis turnos
- Recibir notificaciones
- Actualizar perfil

### Administradores
- Panel de control completo
- Gestionar usuarios y odontólogos
- Ver todos los turnos
- Gestionar servicios
- Estadísticas del sistema

### Odontólogos
- Ver agenda personal
- Gestionar turnos asignados
- Actualizar estados de citas
- Agregar observaciones médicas

## 🔄 API Endpoints

### Autenticación
- `POST /login` - Iniciar sesión
- `POST /usuarios` - Registrar usuario

### Turnos
- `GET /turnos` - Listar todos los turnos
- `POST /turnos` - Crear nuevo turno
- `PUT /turnos/:id` - Modificar turno
- `DELETE /turnos/:id` - Cancelar turno
- `GET /turnos/mis-turnos/:userId` - Turnos del usuario

### Notificaciones
- `GET /notificaciones/usuario/:id` - Notificaciones del usuario
- `PUT /notificaciones/:id/leer` - Marcar como leída

## 🚀 Deployment

### Backend (Render)
1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Root Directory: `sonrisitapp/backend`
4. Build Command: `npm install`
5. Start Command: `npm start`

### Frontend (Vercel)
1. Conectar repositorio GitHub
2. Framework: Create React App
3. Root Directory: `sonrisitapp/frontend`
4. Build Command: `npm run build`
5. Output Directory: `build`

### Base de Datos (Render PostgreSQL)
1. Crear servicio PostgreSQL
2. Ejecutar script `database-postgresql.sql`
3. Configurar variables de conexión en backend

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Francesco** - [Francescoaaa](https://github.com/Francescoaaa)

## 📞 Soporte

Para soporte técnico o consultas:
- GitHub Issues: [Crear Issue](https://github.com/Francescoaaa/proyecto/issues)
- Email: tu-email@ejemplo.com

---

⭐ **¡Dale una estrella al proyecto si te fue útil!** ⭐