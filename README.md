# 🦷 SonrisitApp - Sistema de Gestión de Turnos Odontológicos
<!-- Autor: Francesco - https://github.com/Francescoaaa -->

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

## 📚 Conceptos Técnicos Fundamentales

### ¿Qué es React?
**React** es una librería de JavaScript para construir interfaces de usuario (UI).

**Características principales:**
- **Componentes**: Divide la UI en piezas reutilizables
- **Virtual DOM**: Actualiza solo lo que cambió, no toda la página
- **JSX**: Permite escribir HTML dentro de JavaScript
- **Hooks**: useState, useEffect para manejar estado y efectos
- **Unidireccional**: Los datos fluyen de padre a hijo

**Ejemplo:**
```javascript
function MiComponente({ nombre }) {
    const [contador, setContador] = useState(0);
    
    return (
        <div>
            <h1>Hola {nombre}</h1>
            <p>Contador: {contador}</p>
            <button onClick={() => setContador(contador + 1)}>
                Incrementar
            </button>
        </div>
    );
}
```

### ¿Qué es Node.js?
**Node.js** es un entorno de ejecución que permite usar JavaScript en el servidor.

**Características principales:**
- **JavaScript en el backend**: Mismo lenguaje que el frontend
- **Asíncrono**: Maneja múltiples requests sin bloquear
- **NPM**: Gestor de paquetes con millones de librerías
- **Event-driven**: Basado en eventos y callbacks
- **Cross-platform**: Funciona en Windows, Mac, Linux

**Ventajas:**
- Un solo lenguaje para todo el proyecto
- Excelente para APIs REST
- Gran comunidad y ecosistema
- Ideal para aplicaciones en tiempo real

### ¿Qué es Vite?
**Vite** es una herramienta de desarrollo que hace el proceso más rápido.

**Características:**
- **Hot Module Replacement (HMR)**: Cambios instantáneos sin recargar
- **Build rápido**: Usa esbuild, mucho más rápido que Webpack
- **ES Modules**: Aprovecha módulos nativos del navegador
- **Configuración mínima**: Funciona out-of-the-box

**Comparación:**
- **Create React App**: 30-60 segundos para iniciar
- **Vite**: 1-3 segundos para iniciar

### ¿Qué es Nodemon?
**Nodemon** es una herramienta que reinicia automáticamente el servidor cuando detecta cambios.

**Sin Nodemon:**
```bash
# Cada vez que cambias código:
node server.js
# Ctrl+C para parar
# node server.js para reiniciar
```

**Con Nodemon:**
```bash
nodemon server.js
# Se reinicia automáticamente al guardar cambios
```

**Configuración en package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### ¿Qué es una API?
**API (Application Programming Interface)** es un conjunto de reglas que permite que diferentes aplicaciones se comuniquen.

**Tipos de API:**
- **REST API**: Usa HTTP (GET, POST, PUT, DELETE)
- **GraphQL**: Consultas más flexibles
- **WebSocket**: Comunicación en tiempo real

**Ejemplo REST API:**
```javascript
// GET /usuarios - Obtener todos los usuarios
// POST /usuarios - Crear nuevo usuario
// PUT /usuarios/123 - Actualizar usuario 123
// DELETE /usuarios/123 - Eliminar usuario 123
```

**Estructura de respuesta:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@email.com"
  },
  "message": "Usuario creado exitosamente"
}
```

### ¿Qué consume una API?
**Clientes** que necesitan datos o funcionalidades:

**Frontend (React, Vue, Angular):**
```javascript
// Consumir API desde React
const obtenerUsuarios = async () => {
    const response = await fetch('/api/usuarios');
    const usuarios = await response.json();
    setUsuarios(usuarios);
};
```

**Aplicaciones móviles:**
- React Native
- Flutter
- Apps nativas (iOS, Android)

**Otros servicios:**
- Microservicios
- Sistemas de terceros
- Integraciones (Zapier, webhooks)

### ¿Qué es Express?
**Express** es un framework web para Node.js que simplifica la creación de APIs.

**Sin Express (Node.js puro):**
```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/usuarios' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ usuarios: [] }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
```

**Con Express:**
```javascript
const express = require('express');
const app = express();

app.get('/usuarios', (req, res) => {
    res.json({ usuarios: [] });
});

app.listen(3001);
```

### ¿Para qué sirve Express?
**Funcionalidades principales:**

**1. Routing (Rutas):**
```javascript
app.get('/usuarios', obtenerUsuarios);     // GET
app.post('/usuarios', crearUsuario);       // POST
app.put('/usuarios/:id', actualizarUsuario); // PUT
app.delete('/usuarios/:id', eliminarUsuario); // DELETE
```

**2. Middleware:**
```javascript
// Middleware de autenticación
app.use('/admin', authenticateToken);

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
```

**3. Manejo de errores:**
```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});
```

### ¿Qué es MVC?
**MVC (Model-View-Controller)** es un patrón de arquitectura que separa la aplicación en 3 capas:

**Model (Modelo):**
- Maneja los datos y la lógica de negocio
- Interactúa con la base de datos
- Valida información

```javascript
// models/Usuario.js
class Usuario {
    static async crear(datos) {
        const [result] = await db.execute(
            'INSERT INTO usuarios (nombre, email) VALUES (?, ?)',
            [datos.nombre, datos.email]
        );
        return result.insertId;
    }
}
```

**View (Vista):**
- Presenta los datos al usuario
- En APIs REST, son las respuestas JSON
- En web tradicional, son las páginas HTML

```javascript
// La "vista" en una API REST
res.json({
    status: 'success',
    data: usuarios,
    total: usuarios.length
});
```

**Controller (Controlador):**
- Recibe requests del usuario
- Coordina entre Model y View
- Contiene la lógica de la aplicación

```javascript
// controllers/usuarioController.js
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.obtenerTodos();
        res.json({ usuarios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

**Ventajas del MVC:**
- **Separación de responsabilidades**
- **Código más organizado y mantenible**
- **Facilita el trabajo en equipo**
- **Reutilización de componentes**

### ¿Qué es una API Key?
**API Key** es una clave única que identifica y autentica a quien usa una API.

**Características:**
- **Identificación**: Saber quién hace el request
- **Autenticación**: Verificar que tiene permisos
- **Rate Limiting**: Controlar cuántos requests puede hacer
- **Tracking**: Monitorear uso y estadísticas

**Tipos de API Keys:**

**1. API Key simple:**
```javascript
// En el header
Authorization: Bearer abc123def456

// En query parameter
GET /api/usuarios?api_key=abc123def456
```

**2. JWT Token (como en nuestro proyecto):**
```javascript
// Más seguro, contiene información del usuario
const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);
```

**3. OAuth (Google, Facebook, etc.):**
```javascript
// Para integrar con servicios externos
const googleAuth = {
    client_id: 'tu_client_id',
    client_secret: 'tu_client_secret',
    redirect_uri: 'http://localhost:3000/callback'
};
```

**Ejemplo de uso en nuestro proyecto:**
```javascript
// Frontend envía
fetch('/api/turnos', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

// Backend verifica
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};
```

## 💻 Códigos Más Importantes

### 1. Autenticación JWT (middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Extraer el header Authorization del request
    const authHeader = req.headers['authorization'];
    // El token viene en formato "Bearer TOKEN", extraemos solo el TOKEN
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }
    
    // Verificar que el token sea válido usando la clave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        // Si es válido, agregar los datos del usuario al request
        req.user = user;
        next(); // Continuar al siguiente middleware
    });
};
```
**¿Por qué es importante?** 
- **Seguridad**: Protege rutas sensibles verificando identidad
- **Stateless**: No necesita guardar sesiones en el servidor
- **Escalable**: Funciona en múltiples servidores sin problemas
- **Automático**: Se ejecuta antes de cada ruta protegida

### 2. Conexión a Base de Datos (config/database.js)
```javascript
const mysql = require('mysql2');

// Pool de conexiones para manejar múltiples requests simultáneos
const pool = mysql.createPool({
    host: process.env.DB_HOST,        // Dirección del servidor MySQL
    user: process.env.DB_USER,        // Usuario de la base de datos
    password: process.env.DB_PASSWORD, // Contraseña del usuario
    database: process.env.DB_NAME,    // Nombre de la base de datos
    waitForConnections: true,         // Esperar si no hay conexiones disponibles
    connectionLimit: 10,              // Máximo 10 conexiones simultáneas
    queueLimit: 0                     // Sin límite en la cola de espera
});

// Función para crear una conexión individual
const createConnection = async () => {
    return pool.getConnection();
};
```
**¿Por qué es importante?**
- **Performance**: Pool reutiliza conexiones en lugar de crear nuevas
- **Concurrencia**: Maneja múltiples usuarios simultáneamente
- **Estabilidad**: Evita saturar la base de datos
- **Eficiencia**: Reduce tiempo de conexión y desconexión

### 3. API Service Frontend (services/api.js)
```javascript
// Configuración automática de URL según el entorno
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://sonrisitapp-backend.onrender.com'  // Producción
    : 'http://localhost:3001';                    // Desarrollo

// Función que prepara los headers con autenticación
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        // Solo agregar Authorization si existe token
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Ejemplo de función API con manejo de errores
const crearTurno = async (turnoData) => {
    const response = await fetch(`${API_BASE_URL}/turnos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(turnoData)
    });
    
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
};
```
**¿Por qué es importante?**
- **Centralización**: Todas las llamadas API en un solo lugar
- **Reutilización**: Headers y configuración compartidos
- **Mantenimiento**: Fácil cambiar URLs o configuración
- **Error Handling**: Manejo consistente de errores

### 4. Controlador de Turnos (controllers/turnoController.js)
```javascript
const crearTurno = async (req, res) => {
    // Destructuring: extraer datos del body del request
    const { usuario_id, odontologo_id, servicio_id, fecha, hora } = req.body;
    
    try {
        const connection = await createConnection();
        
        // 1. VERIFICAR DISPONIBILIDAD - Evitar turnos duplicados
        const [existing] = await connection.execute(
            'SELECT * FROM turnos WHERE fecha = ? AND hora = ? AND odontologo_id = ?',
            [fecha, hora, odontologo_id]
        );
        
        if (existing.length > 0) {
            connection.release(); // Liberar conexión
            return res.status(400).json({ error: 'Horario no disponible' });
        }
        
        // 2. CREAR TURNO - Insertar en base de datos
        const [result] = await connection.execute(
            'INSERT INTO turnos (usuario_id, odontologo_id, servicio_id, fecha, hora, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, odontologo_id, servicio_id, fecha, hora, 'reservado']
        );
        
        // 3. CREAR NOTIFICACIÓN - Informar a administradores
        await crearNotificacion({
            usuario_id: 1, // Admin
            tipo: 'nuevo_turno',
            titulo: 'Nuevo Turno Reservado',
            mensaje: `Turno reservado para ${fecha} a las ${hora}`,
            turno_id: result.insertId
        });
        
        connection.release();
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Turno creado exitosamente' 
        });
        
    } catch (error) {
        console.error('Error al crear turno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
```
**¿Por qué es importante?**
- **Lógica de Negocio**: Implementa las reglas del sistema
- **Validación**: Verifica disponibilidad antes de crear
- **Transacciones**: Maneja múltiples operaciones como una unidad
- **Notificaciones**: Mantiene informados a los usuarios

### 5. Componente React Principal (App.js)
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
    // Estado global del usuario logueado
    const [user, setUser] = useState(null);
    
    // useEffect se ejecuta cuando el componente se monta
    useEffect(() => {
        // Verificar si hay sesión guardada al cargar la app
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            // Restaurar sesión del usuario
            setUser(JSON.parse(userData));
        }
    }, []); // [] significa que solo se ejecuta una vez
    
    return (
        <Router>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                
                {/* Rutas protegidas */}
                <Route path="/dashboard" element={
                    user ? <Dashboard user={user} /> : <Navigate to="/login" />
                } />
                <Route path="/admin" element={
                    user?.rol === 'admin' ? <Admin user={user} /> : <Navigate to="/" />
                } />
            </Routes>
        </Router>
    );
}
```
**¿Por qué es importante?**
- **SPA (Single Page Application)**: Navegación sin recargar página
- **Estado Global**: Maneja usuario logueado en toda la app
- **Persistencia**: Mantiene sesión aunque se recargue la página
- **Protección de Rutas**: Controla acceso según autenticación y roles

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

## 🔧 Herramientas de Desarrollo Utilizadas

### Frontend
- **React 18**: Librería para interfaces de usuario
- **React Router**: Navegación entre páginas
- **Tailwind CSS**: Framework de estilos utility-first
- **Material Symbols**: Iconos de Google
- **Vite**: Herramienta de build rápida

### Backend
- **Node.js**: Entorno de ejecución JavaScript
- **Express.js**: Framework web minimalista
- **MySQL2**: Driver para base de datos MySQL
- **JWT**: Autenticación con tokens
- **bcrypt**: Encriptación de contraseñas
- **CORS**: Manejo de peticiones cross-origin
- **Helmet**: Seguridad con headers HTTP
- **Nodemon**: Reinicio automático en desarrollo

### Base de Datos
- **MySQL**: Desarrollo local
- **PostgreSQL**: Producción en Render

### Deployment
- **Render**: Backend y base de datos
- **Vercel/Netlify**: Frontend
- **GitHub Actions**: CI/CD automático

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
- **servicios → turnos**: Un servicio puede estar en mucos turnos (1:N)
- **turnos → notificaciones**: Un turno puede generar varias notificaciones (1:N)

```sql
-- Ejemplo de relaciones con Foreign Keys
CREATE TABLE turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    odontologo_id INT,
    servicio_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    -- Relaciones
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (odontologo_id) REFERENCES odontologos(id) ON DELETE SET NULL,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE RESTRICT
);
```

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
// 1. Try-Catch en controladores
try {
    const [result] = await connection.execute('SELECT * FROM usuarios');
    res.json({ usuarios: result });
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
}

// 2. Middleware global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Errores de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    
    // Errores de base de datos
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'El registro ya existe' });
    }
    
    // Error genérico
    res.status(500).json({ error: 'Error interno del servidor' });
});

// 3. Validación de entrada
const validarTurno = (req, res, next) => {
    const { fecha, hora, usuario_id } = req.body;
    
    if (!fecha || !hora || !usuario_id) {
        return res.status(400).json({ 
            error: 'Faltan campos obligatorios',
            required: ['fecha', 'hora', 'usuario_id']
        });
    }
    
    next();
};
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
```
src/
├── components/           # Componentes reutilizables
│   ├── common/          # Componentes básicos
│   │   ├── Button.js
│   │   ├── Modal.js
│   │   └── Loading.js
│   ├── admin/           # Componentes específicos del admin
│   │   ├── AdminSidebar.js
│   │   └── AdminDashboard.js
│   └── NotificationBell.js
├── pages/               # Páginas completas
│   ├── Login.js
│   ├── Dashboard.js
│   ├── Admin.js
│   └── Landing.js
├── services/            # Lógica de API
│   └── api.js
├── hooks/               # Custom hooks
│   ├── useAuth.js
│   └── useToast.js
├── utils/               # Funciones auxiliares
│   ├── dateUtils.js
│   └── validators.js
└── styles/              # Estilos globales
    └── globals.css
```

**Ejemplo de componente reutilizable:**
```javascript
// components/common/Button.js
const Button = ({ children, variant = 'primary', onClick, disabled }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700'
    };
    
    return (
        <button 
            className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
```

**P: ¿Qué patrón de diseño usaste en el backend?**
**R:**

**1. MVC (Model-View-Controller):**
```
backend/
├── models/              # Lógica de datos
│   ├── Usuario.js
│   └── Turno.js
├── views/               # Respuestas JSON (implícitas)
├── controllers/         # Lógica de negocio
│   ├── usuarioController.js
│   └── turnoController.js
└── routes/              # Definición de rutas
    ├── usuarios.js
    └── turnos.js
```

**2. Middleware Pattern:**
```javascript
// Cadena de middlewares
app.use(cors());                    // 1. Configurar CORS
app.use(express.json());            // 2. Parsear JSON
app.use(authenticateToken);         // 3. Verificar autenticación
app.use(requireAdmin);              // 4. Verificar permisos
app.use('/turnos', turnosRoutes);   // 5. Ejecutar controlador
```

**3. Repository Pattern:**
```javascript
// Abstrae el acceso a datos
class TurnoRepository {
    static async crear(datos) {
        const connection = await createConnection();
        const [result] = await connection.execute(
            'INSERT INTO turnos (usuario_id, fecha, hora) VALUES (?, ?, ?)',
            [datos.usuario_id, datos.fecha, datos.hora]
        );
        connection.release();
        return result.insertId;
    }
    
    static async obtenerPorUsuario(usuarioId) {
        const connection = await createConnection();
        const [turnos] = await connection.execute(
            'SELECT * FROM turnos WHERE usuario_id = ?',
            [usuarioId]
        );
        connection.release();
        return turnos;
    }
}
```

**4. Singleton Pattern:**
```javascript
// Pool de conexiones (una sola instancia)
const mysql = require('mysql2');

class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 10
        });
        
        DatabaseConnection.instance = this;
    }
    
    getConnection() {
        return this.pool.getConnection();
    }
}

module.exports = new DatabaseConnection();
```

---

 