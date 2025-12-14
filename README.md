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

## 💻 Códigos Más Importantes

### 1. Autenticación JWT (middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};
```
**¿Por qué es importante?** Protege todas las rutas sensibles del backend.

### 2. Conexión a Base de Datos (config/database.js)
```javascript
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```
**¿Por qué es importante?** Pool de conexiones para mejor rendimiento.

### 3. API Service Frontend (services/api.js)
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://sonrisitapp-backend.onrender.com'
    : 'http://localhost:3001';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};
```
**¿Por qué es importante?** Maneja la comunicación entre frontend y backend.

### 4. Controlador de Turnos (controllers/turnoController.js)
```javascript
const crearTurno = async (req, res) => {
    const { usuario_id, odontologo_id, servicio_id, fecha, hora } = req.body;
    
    try {
        // Verificar disponibilidad
        const [existing] = await pool.promise().execute(
            'SELECT * FROM turnos WHERE fecha = ? AND hora = ? AND odontologo_id = ?',
            [fecha, hora, odontologo_id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Horario no disponible' });
        }
        
        // Crear turno
        const [result] = await pool.promise().execute(
            'INSERT INTO turnos (usuario_id, odontologo_id, servicio_id, fecha, hora) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, odontologo_id, servicio_id, fecha, hora]
        );
        
        res.status(201).json({ id: result.insertId, message: 'Turno creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear turno' });
    }
};
```
**¿Por qué es importante?** Lógica de negocio principal del sistema.

### 5. Componente React Principal (App.js)
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
            </Routes>
        </Router>
    );
}
```
**¿Por qué es importante?** Maneja el estado global y routing de la aplicación.

## 🎯 Preguntas Frecuentes en Evaluación Oral

### **Arquitectura y Diseño**

**P: ¿Por qué elegiste una arquitectura cliente-servidor separada?**
**R:** Separé frontend y backend para:
- **Escalabilidad**: Cada parte puede escalar independientemente
- **Mantenibilidad**: Equipos diferentes pueden trabajar en paralelo
- **Flexibilidad**: El backend puede servir múltiples clientes (web, móvil)
- **Deployment**: Se pueden desplegar en servidores diferentes

**P: ¿Cómo manejas la seguridad en tu aplicación?**
**R:** Implementé múltiples capas:
- **JWT Tokens**: Para autenticación stateless
- **bcrypt**: Para hash de passwords
- **Middleware de autenticación**: Protege rutas sensibles
- **Validación de entrada**: Previene inyección SQL
- **CORS configurado**: Solo permite orígenes autorizados

### **Base de Datos**

**P: ¿Por qué usaste PostgreSQL en producción y MySQL en desarrollo?**
**R:** 
- **PostgreSQL**: Más robusto para producción, mejor manejo de concurrencia
- **MySQL**: Más fácil de configurar localmente con XAMPP
- **Compatibilidad**: Ambos son SQL estándar, fácil migración

**P: Explica las relaciones en tu base de datos**
**R:**
- **usuarios → turnos**: Un usuario puede tener muchos turnos (1:N)
- **odontologos → turnos**: Un odontólogo atiende muchos turnos (1:N)
- **servicios → turnos**: Un servicio puede estar en muchos turnos (1:N)
- **turnos → notificaciones**: Un turno puede generar varias notificaciones (1:N)

### **Frontend (React)**

**P: ¿Por qué elegiste React?**
**R:**
- **Component-based**: Reutilización de código
- **Virtual DOM**: Mejor rendimiento
- **Ecosystem**: Gran cantidad de librerías
- **Hooks**: Manejo de estado más limpio
- **Community**: Amplio soporte y documentación

**P: ¿Cómo manejas el estado en React?**
**R:**
- **useState**: Para estado local de componentes
- **useEffect**: Para efectos secundarios y lifecycle
- **localStorage**: Para persistir autenticación
- **Context API**: Para estado global (usuario logueado)

### **Backend (Node.js)**

**P: ¿Por qué Node.js y no otro lenguaje?**
**R:**
- **JavaScript**: Mismo lenguaje en frontend y backend
- **Asíncrono**: Excelente para I/O intensivo (base de datos)
- **NPM**: Gran ecosistema de paquetes
- **Rapidez de desarrollo**: Prototipado rápido
- **JSON nativo**: Perfecto para APIs REST

**P: ¿Cómo manejas los errores en tu API?**
**R:**
```javascript
try {
    // Operación de base de datos
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
}
```

### **Deployment y DevOps**

**P: ¿Cómo desplegaste tu aplicación?**
**R:**
- **Backend**: Render.com (gratuito, fácil configuración)
- **Frontend**: Vercel/Netlify (optimizado para React)
- **Base de datos**: PostgreSQL en Render
- **Variables de entorno**: Configuradas en cada plataforma

**P: ¿Qué problemas tuviste durante el desarrollo?**
**R:**
- **Permisos de react-scripts**: Solucionado con npm ci
- **Variables de entorno**: Configuración diferente local vs producción
- **CORS**: Configurar orígenes permitidos para producción
- **Base de datos**: Migración de MySQL local a PostgreSQL producción

### **Funcionalidades del Sistema**

**P: ¿Cómo funciona el sistema de notificaciones?**
**R:**
- **Trigger**: Se crean automáticamente al crear/modificar turnos
- **Tipos**: Confirmación, recordatorio, cancelación, promociones
- **Estado**: Leída/no leída para UX
- **Base de datos**: Tabla notificaciones con relación a turnos

**P: ¿Cómo previenes conflictos de horarios?**
**R:**
```sql
-- Constraint único en base de datos
UNIQUE (fecha, hora, odontologo_id)

-- Validación en backend antes de insertar
SELECT * FROM turnos WHERE fecha = ? AND hora = ? AND odontologo_id = ?
```

**P: ¿Qué validaciones implementaste?**
**R:**
- **Frontend**: Validación de formularios en tiempo real
- **Backend**: Validación de datos antes de insertar en BD
- **Base de datos**: Constraints y foreign keys
- **Autenticación**: Verificación de tokens en cada request

### **Tecnologías y Decisiones**

**P: ¿Por qué usaste Tailwind CSS?**
**R:**
- **Utility-first**: Clases predefinidas para desarrollo rápido
- **Responsive**: Sistema de breakpoints integrado
- **Customizable**: Fácil personalización de colores y espaciado
- **Performance**: Solo incluye CSS que realmente usas

**P: ¿Cómo organizaste los componentes en React?**
**R:**
- **Pages**: Componentes de página completa (Login, Dashboard)
- **Components**: Componentes reutilizables (Button, Modal, Card)
- **Services**: Lógica de API y comunicación con backend
- **Hooks**: Custom hooks para lógica compartida (useToast)

**P: ¿Qué patrón de diseño usaste en el backend?**
**R:**
- **MVC**: Separación en Models (DB), Views (JSON), Controllers
- **Middleware**: Patrón de cadena para autenticación y validación
- **Repository**: Abstracción de acceso a datos
- **Singleton**: Pool de conexiones a base de datos

---

 