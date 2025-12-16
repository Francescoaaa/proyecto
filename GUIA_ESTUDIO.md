# 📚 GUÍA DE ESTUDIO - SonrisitApp

## 🎯 CONCEPTOS BÁSICOS PARA MEMORIZAR

### ¿Qué es React?
**RESPUESTA CORTA:** React es una librería de JavaScript para crear interfaces de usuario con componentes reutilizables.

**EXPLICACIÓN DETALLADA:**
React fue creado por Facebook en 2013 y revolucionó el desarrollo web. En lugar de manipular directamente el DOM (Document Object Model) como se hacía tradicionalmente, React introduce conceptos que hacen el desarrollo más eficiente y mantenible.

**PUNTOS CLAVE:**
- ✅ **Componentes**: Son como bloques de LEGO reutilizables. Una vez que creas un botón, lo puedes usar en toda la aplicación
- ✅ **Virtual DOM**: React crea una copia virtual del DOM en memoria. Cuando algo cambia, compara la versión anterior con la nueva y solo actualiza lo que realmente cambió (como cambiar solo una palabra en lugar de reescribir toda la página)
- ✅ **JSX**: Es una extensión de JavaScript que permite escribir HTML dentro del código JavaScript. Es más fácil de leer y escribir
- ✅ **Hooks**: Son funciones especiales que permiten "enganchar" funcionalidades a los componentes (useState para manejar datos que cambian, useEffect para ejecutar código cuando algo específico ocurre)
- ✅ **Unidireccional**: Los datos fluyen en una sola dirección, de componentes padre a hijos, lo que hace el código más predecible y fácil de debuggear

**¿Por qué es mejor que JavaScript vanilla?**
- Código más organizado y reutilizable
- Mejor rendimiento gracias al Virtual DOM
- Gran ecosistema de librerías
- Fácil mantenimiento de aplicaciones grandes

**EJEMPLO SIMPLE:**
```javascript
function Saludo({ nombre }) {
    const [contador, setContador] = useState(0);
    
    return (
        <div>
            <h1>Hola {nombre}</h1>
            <p>Clicks: {contador}</p>
            <button onClick={() => setContador(contador + 1)}>
                Hacer click
            </button>
        </div>
    );
}
```

---

### ¿Qué es Node.js?
**RESPUESTA CORTA:** Node.js permite usar JavaScript en el servidor, no solo en el navegador.

**EXPLICACIÓN DETALLADA:**
Antes de Node.js (creado en 2009), JavaScript solo funcionaba en navegadores. Node.js tomó el motor V8 de Google Chrome y lo adaptó para funcionar en servidores, permitiendo usar JavaScript para crear backends, APIs, y aplicaciones de servidor.

**PUNTOS CLAVE:**
- ✅ **JavaScript en backend**: Antes necesitabas aprender PHP, Python, Java, etc. para el backend. Ahora puedes usar JavaScript para todo el proyecto
- ✅ **Asíncrono**: Mientras una operación espera (como consultar la base de datos), Node.js puede atender otros usuarios. Es como un mesero que toma múltiples pedidos sin esperar que la cocina termine el primero
- ✅ **NPM (Node Package Manager)**: Es como una tienda gigante con más de 1 millón de paquetes/librerías gratuitas que puedes usar en tu proyecto
- ✅ **Event-driven**: Funciona con eventos. Cuando algo sucede (llega un request, se completa una consulta), se ejecuta el código correspondiente
- ✅ **Single-threaded**: Usa un solo hilo principal, pero maneja múltiples operaciones eficientemente

**VENTAJAS REALES:**
- Un desarrollador puede manejar todo el proyecto (full-stack)
- Desarrollo más rápido (mismo lenguaje, mismas herramientas)
- Ideal para aplicaciones en tiempo real (chat, notificaciones)
- JSON nativo (perfecto para APIs REST)
- Gran comunidad y documentación

**¿Cuándo NO usar Node.js?**
- Aplicaciones que requieren mucho procesamiento matemático
- Sistemas que necesitan máxima seguridad (bancos, gobierno)

---

### ¿Qué es Vite?
**RESPUESTA CORTA:** Vite es una herramienta que hace el desarrollo de React súper rápido.

**EXPLICACIÓN DETALLADA:**
Vite (pronunciado "vit", significa "rápido" en francés) fue creado por Evan You (creador de Vue.js) en 2020. Surgió porque las herramientas tradicionales como Webpack se volvían lentas en proyectos grandes.

**PUNTOS CLAVE:**
- ✅ **Inicio rápido**: Create React App puede tardar 30-60 segundos en iniciar, Vite solo 1-3 segundos. Es como la diferencia entre encender una computadora vieja vs una nueva
- ✅ **Hot Module Replacement (HMR)**: Cuando cambias código, solo actualiza esa parte específica sin recargar toda la página. Es como cambiar una pieza de un rompecabezas sin desarmar todo
- ✅ **Build optimizado**: Usa esbuild (escrito en Go) que es 10-100x más rápido que herramientas tradicionales escritas en JavaScript
- ✅ **ES Modules nativo**: Aprovecha las capacidades modernas del navegador en lugar de empaquetar todo
- ✅ **Configuración mínima**: Funciona "out of the box" sin configuración compleja

**COMPARACIÓN PRÁCTICA:**
```bash
# Create React App
npx create-react-app mi-app  # 2-5 minutos
cd mi-app
npm start                    # 30-60 segundos

# Vite
npm create vite@latest mi-app -- --template react  # 30 segundos
cd mi-app
npm install                  # 1 minuto
npm run dev                  # 1-3 segundos
```

**¿Por qué es tan rápido?**
- No empaqueta todo en desarrollo, sirve archivos individuales
- Usa herramientas nativas del navegador
- Pre-bundling inteligente de dependencias
- Caché eficiente

---

### ¿Qué es Nodemon?
**RESPUESTA CORTA:** Nodemon reinicia automáticamente el servidor cuando cambias código.

**EXPLICACIÓN DETALLADA:**
Nodemon (Node Monitor) es una herramienta que "vigila" tus archivos. Cuando detecta que guardaste cambios, automáticamente reinicia el servidor Node.js. Es como tener un asistente que reinicia tu aplicación cada vez que haces cambios.

**PROBLEMA QUE RESUELVE:**
Sin Nodemon, cada vez que cambias código en el servidor, debes:
1. Ir a la terminal
2. Presionar Ctrl+C para parar el servidor
3. Escribir `node server.js` para reiniciar
4. Repetir esto cientos de veces al día

**SIN NODEMON (tedioso):**
```bash
node server.js
# Cambias código en server.js
# Ctrl+C para parar
# node server.js para reiniciar
# Cambias código otra vez
# Ctrl+C para parar
# node server.js para reiniciar
# ... y así todo el día
```

**CON NODEMON (automático):**
```bash
nodemon server.js
# Cambias código y automáticamente se reinicia
# Cambias código otra vez y se reinicia solo
# Te enfocas en programar, no en reiniciar
```

**CONFIGURACIÓN EN PACKAGE.JSON:**
```json
{
  "scripts": {
    "start": "node server.js",        // Para producción
    "dev": "nodemon server.js"       // Para desarrollo
  }
}
```

**CARACTERÍSTICAS AVANZADAS:**
- Ignora archivos específicos (node_modules, .git)
- Puede ejecutar comandos personalizados
- Detecta diferentes tipos de archivos (.js, .json, .env)
- Delay configurable para evitar reinicios múltiples

---

### ¿Qué es una API?
**RESPUESTA CORTA:** Una API es como un mesero que lleva pedidos entre el frontend y la base de datos.

**EXPLICACIÓN DETALLADA:**
API significa "Application Programming Interface" (Interfaz de Programación de Aplicaciones). Es un conjunto de reglas y protocolos que permite que diferentes aplicaciones se comuniquen entre sí.

**ANALOGÍA DEL RESTAURANTE:**
- **Cliente (Frontend)**: Tú en el restaurante
- **Mesero (API)**: Lleva tu pedido a la cocina y trae la comida
- **Cocina (Backend/Base de datos)**: Prepara la comida
- **Menú (Documentación API)**: Lista de platos disponibles y cómo pedirlos

**PUNTOS CLAVE:**
- ✅ **REST API**: Architectural style que usa HTTP methods (GET, POST, PUT, DELETE) de forma estándar
- ✅ **Endpoints**: URLs específicas para cada acción, como direcciones de casas
- ✅ **JSON**: Formato de intercambio de datos, fácil de leer para humanos y máquinas
- ✅ **Stateless**: Cada request es independiente, no recuerda requests anteriores
- ✅ **HTTP Status Codes**: 200 (OK), 404 (Not Found), 500 (Server Error), etc.

**EJEMPLO DETALLADO:**
```javascript
// CRUD Operations (Create, Read, Update, Delete)
GET /usuarios           // Obtener todos los usuarios
GET /usuarios/123       // Obtener usuario específico
POST /usuarios          // Crear nuevo usuario
PUT /usuarios/123       // Actualizar usuario completo
PATCH /usuarios/123     // Actualizar parcialmente
DELETE /usuarios/123    // Eliminar usuario

// Endpoints más específicos
GET /usuarios/123/turnos     // Turnos de un usuario
POST /usuarios/123/turnos    // Crear turno para usuario
GET /turnos?fecha=2025-01-20 // Filtrar turnos por fecha
```

**ESTRUCTURA DE RESPUESTA ESTÁNDAR:**
```json
{
  "status": "success",
  "data": {
    "id": 123,
    "nombre": "Juan Pérez",
    "email": "juan@email.com"
  },
  "message": "Usuario obtenido exitosamente",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

---

### ¿Qué consume una API?
**RESPUESTA CORTA:** Cualquier aplicación que necesite datos.

**EXPLICACIÓN DETALLADA:**
Una API puede ser consumida por cualquier cliente que pueda hacer requests HTTP. Es como un restaurante que puede atender a cualquier persona que sepa cómo hacer un pedido.

**TIPOS DE CLIENTES:**

**1. APLICACIONES WEB (Frontend):**
- ✅ **React, Vue, Angular**: Frameworks de JavaScript
- ✅ **Vanilla JavaScript**: JavaScript puro
- ✅ **jQuery**: Librería clásica de JavaScript

**2. APLICACIONES MÓVILES:**
- ✅ **React Native**: JavaScript para móviles
- ✅ **Flutter**: Framework de Google (Dart)
- ✅ **Apps nativas**: Swift (iOS), Kotlin/Java (Android)
- ✅ **Ionic, Cordova**: Híbridas

**3. APLICACIONES DE ESCRITORIO:**
- ✅ **Electron**: Apps de escritorio con JavaScript
- ✅ **Aplicaciones nativas**: C#, Java, Python, etc.

**4. OTROS SERVICIOS:**
- ✅ **Microservicios**: Servicios que se comunican entre sí
- ✅ **Webhooks**: Notificaciones automáticas
- ✅ **Integraciones**: Zapier, IFTTT
- ✅ **Bots**: Chatbots, bots de redes sociales
- ✅ **IoT**: Dispositivos inteligentes

**EJEMPLOS DE CÓDIGO:**

**Frontend React:**
```javascript
const obtenerUsuarios = async () => {
    try {
        const response = await fetch('/api/usuarios', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const usuarios = await response.json();
        setUsuarios(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
};
```

**App Móvil (React Native):**
```javascript
import axios from 'axios';

const obtenerUsuarios = async () => {
    try {
        const response = await axios.get('https://mi-api.com/usuarios');
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
};
```

**Otro Microservicio (Node.js):**
```javascript
const axios = require('axios');

const obtenerDatosUsuario = async (userId) => {
    const response = await axios.get(`http://user-service/usuarios/${userId}`);
    return response.data;
};
```

---

### ¿Qué es Express?
**RESPUESTA CORTA:** Express simplifica crear APIs en Node.js.

**EXPLICACIÓN DETALLADA:**
Express.js es un framework web minimalista y flexible para Node.js. Fue creado en 2010 y se convirtió en el estándar de facto para crear aplicaciones web y APIs en Node.js. Es como tener un conjunto de herramientas pre-construidas que facilitan tareas comunes.

**¿POR QUÉ EXISTE EXPRESS?**
Node.js por sí solo es muy básico para crear servidores web. Tendrías que escribir mucho código para tareas simples como manejar rutas, parsear JSON, manejar cookies, etc.

**COMPARACIÓN DETALLADA:**

**SIN EXPRESS (Node.js puro - complicado):**
```javascript
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;
    
    // Configurar CORS manualmente
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Manejar diferentes rutas manualmente
    if (pathname === '/usuarios' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ usuarios: [] }));
    } else if (pathname === '/usuarios' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                // Procesar data...
                res.writeHead(201);
                res.end(JSON.stringify({ message: 'Usuario creado' }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'JSON inválido' }));
            }
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
});

server.listen(3001, () => {
    console.log('Servidor corriendo en puerto 3001');
});
```

**CON EXPRESS (simple y elegante):**
```javascript
const express = require('express');
const app = express();

// Middleware automático
app.use(express.json());  // Parsea JSON automáticamente
app.use(cors());          // Maneja CORS automáticamente

// Rutas simples y claras
app.get('/usuarios', (req, res) => {
    res.json({ usuarios: [] });
});

app.post('/usuarios', (req, res) => {
    const data = req.body;  // JSON ya parseado automáticamente
    // Procesar data...
    res.status(201).json({ message: 'Usuario creado' });
});

// Manejo de errores automático
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Error interno' });
});

app.listen(3001, () => {
    console.log('Servidor corriendo en puerto 3001');
});
```

**VENTAJAS DE EXPRESS:**
- **Menos código**: 10 líneas vs 50+ líneas
- **Más legible**: Código más fácil de entender
- **Middleware**: Sistema de plugins para funcionalidades
- **Routing avanzado**: Parámetros, wildcards, regex
- **Manejo de errores**: Sistema integrado
- **Ecosistema**: Miles de plugins disponibles

---

### ¿Para qué sirve Express?
**RESPUESTA CORTA:** Para crear rutas, manejar middleware y errores fácilmente.

**EXPLICACIÓN DETALLADA:**
Express tiene múltiples funcionalidades que simplifican el desarrollo de aplicaciones web y APIs. Es como tener un asistente que maneja todas las tareas repetitivas y complejas.

**FUNCIONES PRINCIPALES:**

**1. SISTEMA DE RUTAS (Routing):**
Permite definir qué código ejecutar para cada URL y método HTTP.

```javascript
// Rutas básicas
app.get('/usuarios', obtenerUsuarios);           // GET
app.post('/usuarios', crearUsuario);             // POST
app.put('/usuarios/:id', actualizarUsuario);     // PUT
app.delete('/usuarios/:id', eliminarUsuario);    // DELETE

// Rutas con parámetros
app.get('/usuarios/:id', (req, res) => {
    const id = req.params.id;  // Extrae el ID de la URL
    res.json({ usuario: `Usuario ${id}` });
});

// Rutas con query parameters
app.get('/turnos', (req, res) => {
    const fecha = req.query.fecha;  // ?fecha=2025-01-20
    const estado = req.query.estado; // &estado=reservado
    res.json({ turnos: [], filtros: { fecha, estado } });
});

// Rutas anidadas
app.get('/usuarios/:id/turnos', (req, res) => {
    const userId = req.params.id;
    res.json({ turnos: [], usuario: userId });
});

// Wildcards y patrones
app.get('/archivos/*', (req, res) => {
    const archivo = req.params[0];  // Todo después de /archivos/
    res.json({ archivo });
});
```

**2. SISTEMA DE MIDDLEWARE:**
Funciones que se ejecutan antes de llegar al controlador final. Es como una cadena de filtros.

```javascript
// Middleware global (se ejecuta en todas las rutas)
app.use(express.json());              // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear formularios
app.use(cors());                      // Permitir CORS

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next(); // IMPORTANTE: llamar next() para continuar
});

// Middleware condicional
app.use('/admin', (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    next();
});

// Middleware específico para una ruta
app.get('/usuarios', verificarAuth, verificarPermisos, obtenerUsuarios);

// Middleware de validación
const validarUsuario = (req, res, next) => {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email requeridos' });
    }
    next();
};

app.post('/usuarios', validarUsuario, crearUsuario);
```

**3. MANEJO DE ERRORES:**
Sistema centralizado para manejar errores en toda la aplicación.

```javascript
// Middleware de manejo de errores (SIEMPRE al final)
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    // Errores específicos
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            error: 'Datos inválidos', 
            details: err.message 
        });
    }
    
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
            error: 'El registro ya existe' 
        });
    }
    
    // Error genérico
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.originalUrl 
    });
});
```

**4. FUNCIONALIDADES ADICIONALES:**

```javascript
// Servir archivos estáticos
app.use('/public', express.static('public'));

// Templates engines
app.set('view engine', 'ejs');
app.render('index', { titulo: 'Mi App' });

// Configuración de la aplicación
app.set('port', process.env.PORT || 3001);
app.set('env', 'development');

// Cookies y sesiones
app.use(cookieParser());
app.use(session({ secret: 'mi-secreto' }));
```

---

### ¿Qué es MVC?
**RESPUESTA CORTA:** MVC separa la aplicación en 3 partes: Modelo (datos), Vista (presentación), Controlador (lógica).

**EXPLICACIÓN DETALLADA:**
MVC (Model-View-Controller) es un patrón de arquitectura de software que separa la aplicación en tres componentes interconectados. Fue creado en los años 70 y sigue siendo uno de los patrones más utilizados porque organiza el código de manera lógica y mantenible.

**ANALOGÍA DEL RESTAURANTE:**
- **Model (Cocina)**: Prepara la comida, maneja ingredientes, recetas
- **View (Plato servido)**: Cómo se presenta la comida al cliente
- **Controller (Mesero)**: Toma el pedido, coordina con la cocina, sirve al cliente

**COMPONENTES DETALLADOS:**

**MODEL (Modelo) - La Lógica de Datos:**
Se encarga de todo lo relacionado con datos: obtenerlos, validarlos, guardarlos, transformarlos.

```javascript
// models/Usuario.js
class Usuario {
    // Crear usuario
    static async crear(datos) {
        // Validar datos
        if (!datos.email || !datos.nombre) {
            throw new Error('Email y nombre son requeridos');
        }
        
        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(datos.password, 10);
        
        // Guardar en base de datos
        const [result] = await db.execute(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [datos.nombre, datos.email, passwordHash]
        );
        
        return result.insertId;
    }
    
    // Obtener todos los usuarios
    static async obtenerTodos() {
        const [usuarios] = await db.execute(
            'SELECT id, nombre, email, created_at FROM usuarios WHERE activo = 1'
        );
        return usuarios;
    }
    
    // Buscar por email
    static async buscarPorEmail(email) {
        const [usuarios] = await db.execute(
            'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
            [email]
        );
        return usuarios[0] || null;
    }
    
    // Validar contraseña
    static async validarPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}
```

**VIEW (Vista) - La Presentación:**
En aplicaciones web tradicionales son las páginas HTML. En APIs REST son las respuestas JSON.

```javascript
// En APIs REST, las "vistas" son las respuestas JSON estructuradas

// Vista exitosa
res.status(200).json({
    status: 'success',
    data: {
        usuarios: [
            { id: 1, nombre: 'Juan', email: 'juan@email.com' },
            { id: 2, nombre: 'Ana', email: 'ana@email.com' }
        ]
    },
    total: 2,
    message: 'Usuarios obtenidos exitosamente'
});

// Vista de error
res.status(400).json({
    status: 'error',
    error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos',
        details: {
            email: 'Email es requerido',
            nombre: 'Nombre debe tener al menos 2 caracteres'
        }
    },
    timestamp: new Date().toISOString()
});

// En aplicaciones web tradicionales serían templates HTML
// views/usuarios.ejs
/*
<html>
<body>
    <h1>Lista de Usuarios</h1>
    <% usuarios.forEach(usuario => { %>
        <div>
            <h3><%= usuario.nombre %></h3>
            <p><%= usuario.email %></p>
        </div>
    <% }); %>
</body>
</html>
*/
```

**CONTROLLER (Controlador) - La Lógica de Negocio:**
Recibe requests, coordina entre Model y View, maneja la lógica de la aplicación.

```javascript
// controllers/usuarioController.js
const Usuario = require('../models/Usuario');

class UsuarioController {
    // Obtener todos los usuarios
    static async obtenerTodos(req, res) {
        try {
            // 1. Obtener datos del modelo
            const usuarios = await Usuario.obtenerTodos();
            
            // 2. Procesar/transformar si es necesario
            const usuariosFormateados = usuarios.map(usuario => ({
                ...usuario,
                created_at: new Date(usuario.created_at).toLocaleDateString()
            }));
            
            // 3. Enviar respuesta (vista)
            res.json({
                status: 'success',
                data: { usuarios: usuariosFormateados },
                total: usuarios.length
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }
    
    // Crear usuario
    static async crear(req, res) {
        try {
            // 1. Extraer datos del request
            const { nombre, email, password } = req.body;
            
            // 2. Validaciones de negocio
            if (!nombre || !email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Todos los campos son requeridos'
                });
            }
            
            // 3. Verificar si el usuario ya existe
            const usuarioExistente = await Usuario.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({
                    status: 'error',
                    message: 'El email ya está registrado'
                });
            }
            
            // 4. Crear usuario usando el modelo
            const usuarioId = await Usuario.crear({ nombre, email, password });
            
            // 5. Responder con éxito
            res.status(201).json({
                status: 'success',
                data: { id: usuarioId },
                message: 'Usuario creado exitosamente'
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }
}

module.exports = UsuarioController;
```

**VENTAJAS DEL PATRÓN MVC:**
- **Separación de responsabilidades**: Cada componente tiene una función específica
- **Mantenibilidad**: Cambios en una parte no afectan las otras
- **Reutilización**: Los modelos pueden usarse en diferentes controladores
- **Testabilidad**: Cada componente se puede probar independientemente
- **Trabajo en equipo**: Diferentes desarrolladores pueden trabajar en diferentes capas
- **Escalabilidad**: Fácil agregar nuevas funcionalidades

**ESTRUCTURA DE CARPETAS:**
```
backend/
├── models/              # Lógica de datos
│   ├── Usuario.js
│   ├── Turno.js
│   └── Servicio.js
├── views/               # Templates (si usas server-side rendering)
│   ├── usuarios.ejs
│   └── turnos.ejs
├── controllers/         # Lógica de negocio
│   ├── usuarioController.js
│   ├── turnoController.js
│   └── servicioController.js
└── routes/              # Definición de rutas
    ├── usuarios.js
    ├── turnos.js
    └── servicios.js
```

---

### ¿Qué es una API Key?
**RESPUESTA CORTA:** Una API Key es como una llave que identifica quién usa la API.

**EXPLICACIÓN DETALLADA:**
Una API Key es un código único que actúa como identificador y autenticador para acceder a una API. Es como tener una tarjeta de identificación que te permite entrar a un edificio y también registra quién eres y qué permisos tienes.

**¿POR QUÉ EXISTEN LAS API KEYS?**
- **Identificación**: Saber quién está usando la API
- **Autenticación**: Verificar que tienes permisos para usar la API
- **Autorización**: Controlar qué recursos puedes acceder
- **Rate Limiting**: Limitar cuántas requests puedes hacer por minuto/hora
- **Tracking**: Monitorear uso, generar estadísticas, facturación
- **Seguridad**: Prevenir uso no autorizado

**TIPOS DE API KEYS:**

**1. API KEY SIMPLE:**
Un string estático que se envía en cada request.

```javascript
// En el header
fetch('/api/usuarios', {
    headers: {
        'Authorization': 'Bearer abc123def456',
        'X-API-Key': 'mi-api-key-secreta'
    }
});

// En query parameter (menos seguro)
fetch('/api/usuarios?api_key=abc123def456');

// Ejemplo de validación en el servidor
const validarApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
        return res.status(401).json({ error: 'API Key requerida' });
    }
    
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'API Key inválida' });
    }
    
    next();
};
```

**VENTAJAS:** Simple de implementar
**DESVENTAJAS:** No expira, no contiene información del usuario

**2. JWT TOKEN (nuestro proyecto):**
Token que contiene información encriptada y tiene expiración.

```javascript
// Crear JWT
const jwt = require('jsonwebtoken');

const crearToken = (usuario) => {
    return jwt.sign(
        { 
            id: usuario.id, 
            email: usuario.email, 
            rol: usuario.rol,
            iat: Math.floor(Date.now() / 1000)  // Issued at
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: '24h',
            issuer: 'sonrisitapp',
            audience: 'sonrisitapp-users'
        }
    );
};

// Usar JWT
fetch('/api/turnos', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
});

// Validar JWT
const validarJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Información del usuario disponible
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(403).json({ error: 'Token inválido' });
    }
};
```

**VENTAJAS:** Contiene información, expira automáticamente, stateless
**DESVENTAJAS:** Más complejo de implementar

**3. OAUTH (Google, Facebook, GitHub):**
Protocolo estándar para autorización de terceros.

```javascript
// Configuración OAuth (Google)
const googleAuth = {
    client_id: '123456789-abcdef.apps.googleusercontent.com',
    client_secret: 'tu_client_secret',
    redirect_uri: 'http://localhost:3000/auth/google/callback',
    scope: 'openid email profile'
};

// Flujo OAuth
// 1. Redirigir al usuario a Google
const authUrl = `https://accounts.google.com/oauth/authorize?` +
    `client_id=${googleAuth.client_id}&` +
    `redirect_uri=${googleAuth.redirect_uri}&` +
    `scope=${googleAuth.scope}&` +
    `response_type=code`;

// 2. Google redirige de vuelta con un código
// 3. Intercambiar código por token
const exchangeCodeForToken = async (code) => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: googleAuth.client_id,
            client_secret: googleAuth.client_secret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: googleAuth.redirect_uri
        })
    });
    
    const tokens = await response.json();
    return tokens.access_token;
};

// 4. Usar token para obtener información del usuario
const getUserInfo = async (accessToken) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    return await response.json();
};
```

**VENTAJAS:** Muy seguro, estándar de la industria, no necesitas manejar contraseñas
**DESVENTAJAS:** Complejo de implementar, dependes de terceros

**4. API KEYS CON SCOPES (Permisos específicos):**
```javascript
// API Key con permisos específicos
const apiKeys = {
    'key_123': {
        name: 'App Móvil',
        scopes: ['read:usuarios', 'write:turnos'],
        rateLimit: 1000  // requests por hora
    },
    'key_456': {
        name: 'Dashboard Admin',
        scopes: ['read:*', 'write:*', 'delete:*'],
        rateLimit: 10000
    }
};

const validarPermisos = (requiredScope) => {
    return (req, res, next) => {
        const apiKey = req.headers['x-api-key'];
        const keyInfo = apiKeys[apiKey];
        
        if (!keyInfo) {
            return res.status(403).json({ error: 'API Key inválida' });
        }
        
        const hasPermission = keyInfo.scopes.some(scope => 
            scope === requiredScope || scope === 'write:*' || scope === 'read:*'
        );
        
        if (!hasPermission) {
            return res.status(403).json({ error: 'Permisos insuficientes' });
        }
        
        req.apiKeyInfo = keyInfo;
        next();
    };
};

// Uso
app.get('/usuarios', validarPermisos('read:usuarios'), obtenerUsuarios);
app.post('/turnos', validarPermisos('write:turnos'), crearTurno);
```

**MEJORES PRÁCTICAS:**
- Nunca hardcodear API keys en el código
- Usar HTTPS siempre
- Implementar rate limiting
- Rotar keys periódicamente
- Monitorear uso sospechoso
- Usar diferentes keys para diferentes entornos (dev, staging, prod)

---

## 🔥 CÓDIGOS IMPORTANTES PARA MEMORIZAR

*Estos son los 5 códigos más importantes de tu proyecto. Debes entender cada línea y poder explicarlos sin mirar.*

### 1. Autenticación JWT - El Guardia de Seguridad

**¿QUÉ HACE?** Este código actúa como un guardia de seguridad que verifica la identidad de cada usuario antes de permitirle acceso a rutas protegidas.

```javascript
const authenticateToken = (req, res, next) => {
    // 1. EXTRAER TOKEN: Buscar el token en el header Authorization
    // El header viene como "Bearer abc123def456", necesitamos solo "abc123def456"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // 2. VERIFICAR EXISTENCIA: Si no hay token, denegar acceso
    if (!token) {
        return res.status(401).json({ 
            error: 'Token de acceso requerido',
            message: 'Debes estar logueado para acceder a este recurso'
        });
    }
    
    // 3. VERIFICAR VALIDEZ: Comprobar que el token sea válido y no haya expirado
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Token expirado o inválido
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    error: 'Token expirado',
                    expired: true 
                });
            }
            return res.status(403).json({ error: 'Token inválido' });
        }
        
        // 4. GUARDAR DATOS: Si todo está bien, guardar info del usuario
        req.user = user; // Ahora req.user contiene {id, email, rol}
        next(); // Continuar al siguiente middleware o controlador
    });
};
```

**¿CÓMO FUNCIONA PASO A PASO?**
1. **Usuario hace login** → Servidor genera JWT con datos del usuario
2. **Frontend guarda token** → localStorage.setItem('token', jwt)
3. **Usuario hace request** → Frontend envía token en header Authorization
4. **Middleware verifica** → authenticateToken valida el token
5. **Si es válido** → Permite acceso y guarda datos en req.user
6. **Si es inválido** → Devuelve error 401/403

**¿POR QUÉ ES IMPORTANTE?**
- **Seguridad**: Solo usuarios autenticados pueden acceder a rutas protegidas
- **Stateless**: El servidor no guarda sesiones, toda la info está en el token
- **Escalable**: Funciona en múltiples servidores sin problemas
- **Automático**: Se ejecuta antes de cada ruta protegida sin código extra
- **Informativo**: Proporciona datos del usuario (id, email, rol) a los controladores

**EJEMPLO DE USO:**
```javascript
// Ruta protegida
app.get('/admin/usuarios', authenticateToken, requireAdmin, (req, res) => {
    // req.user ya contiene los datos del usuario logueado
    console.log('Usuario logueado:', req.user.email);
    console.log('Rol del usuario:', req.user.rol);
    res.json({ usuarios: [] });
});
```

### 2. Pool de Conexiones - El Administrador de Base de Datos

**¿QUÉ HACE?** Este código crea un "pool" (piscina) de conexiones a la base de datos que se reutilizan eficientemente, como tener varios teléfonos disponibles en lugar de uno solo.

```javascript
const mysql = require('mysql2');

// CREAR POOL: Como tener 10 teléfonos disponibles para llamar a la BD
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',     // Dónde está la BD
    user: process.env.DB_USER || 'root',          // Usuario de MySQL
    password: process.env.DB_PASSWORD || '',      // Contraseña
    database: process.env.DB_NAME || 'sonrisitapp', // Nombre de la BD
    
    // CONFIGURACIÓN DEL POOL
    connectionLimit: 10,        // Máximo 10 conexiones simultáneas
    waitForConnections: true,   // Esperar si todas están ocupadas
    queueLimit: 0,             // Sin límite de cola de espera
    acquireTimeout: 60000,     // 60 segundos máx para obtener conexión
    timeout: 60000,            // 60 segundos máx para queries
    reconnect: true,           // Reconectar automáticamente
    
    // CONFIGURACIÓN ADICIONAL
    charset: 'utf8mb4',        // Soporte para emojis y caracteres especiales
    timezone: 'local'          // Usar zona horaria local
});

// FUNCIÓN HELPER: Para obtener una conexión del pool
const createConnection = async () => {
    try {
        const connection = await pool.promise().getConnection();
        console.log('Conexión obtenida del pool');
        return connection;
    } catch (error) {
        console.error('Error al obtener conexión:', error);
        throw error;
    }
};

// MANEJO DE EVENTOS DEL POOL
pool.on('connection', (connection) => {
    console.log('Nueva conexión establecida:', connection.threadId);
});

pool.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Conexión perdida, reintentando...');
    }
});

module.exports = { pool, createConnection };
```

**PROBLEMA QUE RESUELVE:**

**SIN POOL (ineficiente):**
```javascript
// Cada request crea una nueva conexión
const obtenerUsuarios = async () => {
    const connection = mysql.createConnection({...}); // LENTO: crear conexión
    const [usuarios] = await connection.execute('SELECT * FROM usuarios');
    await connection.end(); // LENTO: cerrar conexión
    return usuarios;
};
// Si 100 usuarios hacen requests simultáneos = 100 conexiones nuevas
```

**CON POOL (eficiente):**
```javascript
// Reutiliza conexiones existentes
const obtenerUsuarios = async () => {
    const connection = await pool.getConnection(); // RÁPIDO: reutilizar
    const [usuarios] = await connection.execute('SELECT * FROM usuarios');
    connection.release(); // RÁPIDO: devolver al pool
    return usuarios;
};
// Si 100 usuarios hacen requests = reutiliza las mismas 10 conexiones
```

**¿CÓMO FUNCIONA?**
1. **Al iniciar la app** → Se crean 10 conexiones a MySQL
2. **Usuario hace request** → Se toma una conexión del pool
3. **Se ejecuta la query** → SELECT, INSERT, UPDATE, DELETE
4. **Se libera la conexión** → connection.release() la devuelve al pool
5. **Otro usuario** → Reutiliza la misma conexión

**¿POR QUÉ ES IMPORTANTE?**
- **Performance**: 10x más rápido que crear conexiones nuevas
- **Concurrencia**: 10 usuarios pueden hacer queries simultáneamente
- **Estabilidad**: No satura MySQL con miles de conexiones
- **Eficiencia**: Reutiliza recursos en lugar de desperdiciarlos
- **Escalabilidad**: Maneja carga alta sin problemas

**EJEMPLO DE USO:**
```javascript
const crearTurno = async (req, res) => {
    let connection;
    try {
        // 1. Obtener conexión del pool
        connection = await createConnection();
        
        // 2. Usar la conexión para múltiples queries
        const [existing] = await connection.execute(
            'SELECT * FROM turnos WHERE fecha = ? AND hora = ?',
            [fecha, hora]
        );
        
        if (existing.length === 0) {
            const [result] = await connection.execute(
                'INSERT INTO turnos (usuario_id, fecha, hora) VALUES (?, ?, ?)',
                [usuario_id, fecha, hora]
            );
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // 3. IMPORTANTE: Siempre liberar la conexión
        if (connection) connection.release();
    }
};
```

### 3. API Service Frontend - El Comunicador Universal

**¿QUÉ HACE?** Este código centraliza toda la comunicación entre el frontend (React) y el backend (Node.js), como tener un traductor universal que maneja todos los idiomas.

```javascript
// CONFIGURACIÓN INTELIGENTE: Cambia automáticamente según el entorno
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://sonrisitapp-backend.onrender.com'  // Servidor en producción
    : 'http://localhost:3001';                    // Servidor local

// HEADERS INTELIGENTES: Incluye autenticación automáticamente
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    
    return {
        'Content-Type': 'application/json',
        // Solo agregar Authorization si hay token
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// MANEJO DE ERRORES CENTRALIZADO
const handleResponse = async (response) => {
    // Si el token expiró, redirigir al login
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
    }
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
    }
    
    return response.json();
};

// FUNCIONES DE API ORGANIZADAS
const api = {
    // === AUTENTICACIÓN ===
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return handleResponse(response);
    },
    
    // === USUARIOS ===
    obtenerUsuarios: async () => {
        const response = await fetch(`${API_BASE_URL}/usuarios/todos`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },
    
    crearUsuario: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },
    
    // === TURNOS ===
    listarTurnos: async () => {
        const response = await fetch(`${API_BASE_URL}/turnos/disponibles`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },
    
    crearTurno: async (turnoData) => {
        const response = await fetch(`${API_BASE_URL}/turnos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(turnoData)
        });
        return handleResponse(response);
    },
    
    eliminarTurno: async (id, motivo) => {
        const response = await fetch(`${API_BASE_URL}/turnos/${id}/eliminar`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ motivo })
        });
        return handleResponse(response);
    },
    
    // === NOTIFICACIONES ===
    obtenerNotificaciones: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/notificaciones/usuario/${userId}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

export default api;
```

**¿CÓMO SE USA EN LOS COMPONENTES?**
```javascript
// En cualquier componente React
import api from '../services/api';

const MiComponente = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const data = await api.obtenerUsuarios(); // Simple y limpio
            setUsuarios(data);
        } catch (error) {
            console.error('Error:', error.message);
            // El manejo de errores ya está centralizado
        } finally {
            setLoading(false);
        }
    };
    
    const crearNuevoUsuario = async (userData) => {
        try {
            await api.crearUsuario(userData);
            await cargarUsuarios(); // Recargar lista
        } catch (error) {
            alert('Error al crear usuario: ' + error.message);
        }
    };
    
    return (
        <div>
            {loading ? <p>Cargando...</p> : null}
            {/* Resto del componente */}
        </div>
    );
};
```

**¿POR QUÉ ES IMPORTANTE?**
- **Centralización**: Todas las llamadas API en un solo archivo
- **Reutilización**: Mismas funciones en todos los componentes
- **Mantenimiento**: Cambiar una URL afecta toda la app
- **Consistencia**: Mismo formato de headers y manejo de errores
- **Inteligencia**: Cambia automáticamente entre desarrollo y producción
- **Seguridad**: Maneja tokens JWT automáticamente
- **Error Handling**: Manejo centralizado de errores y redirecciones

**VENTAJAS VS FETCH DIRECTO:**

**Sin API Service (repetitivo):**
```javascript
// En cada componente tienes que repetir esto
const obtenerUsuarios = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/usuarios/todos', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }
    
    if (!response.ok) {
        throw new Error('Error al obtener usuarios');
    }
    
    return response.json();
};
```

**Con API Service (simple):**
```javascript
// En cualquier componente
const usuarios = await api.obtenerUsuarios();
```

### 4. Controlador de Turnos - El Cerebro del Sistema

**¿QUÉ HACE?** Este código implementa la lógica de negocio principal del sistema: crear turnos. Es como el cerebro que toma decisiones inteligentes y coordina múltiples operaciones.

```javascript
const { createConnection } = require('../config/database');
const { crearNotificacion } = require('./notificacionController');

const crearTurno = async (req, res) => {
    // EXTRAER DATOS: Obtener información del request
    const { usuario_id, odontologo_id, servicio_id, fecha, hora, observaciones } = req.body;
    
    // LOGGING: Registrar la operación para debugging
    console.log('CREAR_TURNO: Iniciando creación de turno:', {
        usuario_id, fecha, hora, servicio: servicio_id
    });
    
    let connection;
    
    try {
        // PASO 1: VALIDACIÓN DE ENTRADA
        if (!usuario_id || !fecha || !hora || !servicio_id) {
            return res.status(400).json({
                error: 'Datos incompletos',
                required: ['usuario_id', 'fecha', 'hora', 'servicio_id']
            });
        }
        
        // PASO 2: OBTENER CONEXIÓN A LA BASE DE DATOS
        connection = await createConnection();
        console.log('CREAR_TURNO: Conexión obtenida');
        
        // PASO 3: VERIFICAR DISPONIBILIDAD (Evitar conflictos)
        const [existing] = await connection.execute(
            `SELECT t.id, u.nombre as usuario_nombre 
             FROM turnos t 
             JOIN usuarios u ON t.usuario_id = u.id 
             WHERE t.fecha = ? AND t.hora = ? AND t.odontologo_id = ? 
             AND t.estado IN ('reservado', 'confirmado')`,
            [fecha, hora, odontologo_id]
        );
        
        if (existing.length > 0) {
            console.log('CREAR_TURNO: Horario ocupado por:', existing[0].usuario_nombre);
            return res.status(400).json({ 
                error: 'Horario no disponible',
                details: `Ya existe un turno reservado para ${fecha} a las ${hora}`,
                conflicto: existing[0]
            });
        }
        
        // PASO 4: VALIDAR QUE EL USUARIO EXISTE
        const [usuario] = await connection.execute(
            'SELECT id, nombre, email FROM usuarios WHERE id = ? AND activo = 1',
            [usuario_id]
        );
        
        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        // PASO 5: VALIDAR QUE EL SERVICIO EXISTE
        const [servicio] = await connection.execute(
            'SELECT id, nombre, precio FROM servicios WHERE id = ? AND activo = 1',
            [servicio_id]
        );
        
        if (servicio.length === 0) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        
        // PASO 6: CREAR EL TURNO
        const [result] = await connection.execute(
            `INSERT INTO turnos 
             (usuario_id, odontologo_id, servicio_id, fecha, hora, estado, observaciones, precio) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                usuario_id, 
                odontologo_id, 
                servicio_id, 
                fecha, 
                hora, 
                'reservado',
                observaciones || null,
                servicio[0].precio
            ]
        );
        
        const turnoId = result.insertId;
        console.log('CREAR_TURNO: Turno creado con ID:', turnoId);
        
        // PASO 7: CREAR NOTIFICACIÓN PARA ADMINISTRADORES
        try {
            // Obtener todos los administradores
            const [admins] = await connection.execute(
                'SELECT id FROM usuarios WHERE rol = "admin" AND activo = 1'
            );
            
            // Crear notificación para cada admin
            for (const admin of admins) {
                await crearNotificacion({
                    usuario_id: admin.id,
                    tipo: 'nuevo_turno',
                    titulo: 'Nuevo Turno Reservado',
                    mensaje: `${usuario[0].nombre} ha reservado un turno de ${servicio[0].nombre} para el ${fecha} a las ${hora}`,
                    turno_id: turnoId
                });
            }
            
            console.log('CREAR_TURNO: Notificaciones enviadas a', admins.length, 'administradores');
        } catch (notifError) {
            // Si falla la notificación, no cancelar el turno
            console.error('CREAR_TURNO: Error al crear notificaciones:', notifError.message);
        }
        
        // PASO 8: RESPUESTA EXITOSA
        res.status(201).json({
            status: 'success',
            data: {
                id: turnoId,
                usuario: usuario[0].nombre,
                servicio: servicio[0].nombre,
                fecha: fecha,
                hora: hora,
                precio: servicio[0].precio
            },
            message: 'Turno creado exitosamente'
        });
        
    } catch (error) {
        console.error('CREAR_TURNO: Error:', error);
        
        // MANEJO DE ERRORES ESPECÍFICOS
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'Conflicto de horario',
                message: 'Ya existe un turno en ese horario'
            });
        }
        
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                error: 'Referencia inválida',
                message: 'Usuario, odontólogo o servicio no válido'
            });
        }
        
        // ERROR GENÉRICO
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
            message: 'No se pudo crear el turno',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        // PASO 9: LIBERAR CONEXIÓN (SIEMPRE)
        if (connection) {
            connection.release();
            console.log('CREAR_TURNO: Conexión liberada');
        }
    }
};

module.exports = { crearTurno };
```

**¿CÓMO FUNCIONA PASO A PASO?**
1. **Recibe datos** → Frontend envía usuario_id, fecha, hora, servicio_id
2. **Valida entrada** → Verifica que todos los campos requeridos estén presentes
3. **Obtiene conexión** → Del pool de conexiones MySQL
4. **Verifica disponibilidad** → Consulta si ya hay un turno en esa fecha/hora
5. **Valida referencias** → Verifica que usuario y servicio existan
6. **Crea el turno** → INSERT en la tabla turnos
7. **Notifica admins** → Crea notificaciones para todos los administradores
8. **Responde éxito** → Devuelve datos del turno creado
9. **Libera conexión** → Devuelve la conexión al pool

**¿POR QUÉ ES IMPORTANTE?**
- **Lógica de Negocio**: Implementa las reglas del sistema (no turnos duplicados)
- **Validación Completa**: Verifica datos antes de guardar
- **Transaccionalidad**: Maneja múltiples operaciones como una unidad
- **Notificaciones Automáticas**: Informa a administradores sin intervención manual
- **Manejo de Errores**: Respuestas específicas para cada tipo de error
- **Logging**: Registra operaciones para debugging y auditoría
- **Seguridad**: Previene conflictos y datos inconsistentes

**EJEMPLO DE RESPUESTA:**
```json
// Éxito
{
  "status": "success",
  "data": {
    "id": 15,
    "usuario": "Juan Pérez",
    "servicio": "Limpieza dental",
    "fecha": "2025-01-25",
    "hora": "14:30:00",
    "precio": 2500.00
  },
  "message": "Turno creado exitosamente"
}

// Error
{
  "error": "Horario no disponible",
  "details": "Ya existe un turno reservado para 2025-01-25 a las 14:30:00",
  "conflicto": {
    "id": 12,
    "usuario_nombre": "Ana García"
  }
}
```

### 5. Componente React Principal - El Director de Orquesta

**¿QUÉ HACE?** Este código es el "director de orquesta" de toda la aplicación React. Maneja el estado global del usuario, la navegación entre páginas y la protección de rutas.

```javascript
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar todas las páginas
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
    // ESTADO GLOBAL: Usuario logueado (disponible en toda la app)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // EFECTO DE INICIALIZACIÓN: Se ejecuta una sola vez al cargar la app
    useEffect(() => {
        console.log('APP: Inicializando aplicación...');
        
        // RESTAURAR SESIÓN: Verificar si hay sesión guardada
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                // Parsear datos del usuario
                const parsedUser = JSON.parse(userData);
                
                // Verificar que el token no haya expirado
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const now = Math.floor(Date.now() / 1000);
                
                if (tokenPayload.exp > now) {
                    // Token válido, restaurar sesión
                    setUser(parsedUser);
                    console.log('APP: Sesión restaurada para:', parsedUser.email);
                } else {
                    // Token expirado, limpiar
                    console.log('APP: Token expirado, limpiando sesión');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('APP: Error al restaurar sesión:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else {
            console.log('APP: No hay sesión guardada');
        }
        
        setLoading(false);
    }, []); // [] = solo se ejecuta una vez
    
    // FUNCIÓN DE LOGOUT: Limpiar sesión
    const handleLogout = () => {
        console.log('APP: Cerrando sesión');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };
    
    // COMPONENTE DE CARGA
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">Cargando aplicación...</p>
            </div>
        );
    }
    
    return (
        <Router>
            <div className="App">
                {/* RUTAS DE LA APLICACIÓN */}
                <Routes>
                    {/* RUTAS PÚBLICAS (sin autenticación) */}
                    <Route 
                        path="/" 
                        element={<Landing />} 
                    />
                    
                    <Route 
                        path="/register" 
                        element={
                            // Si ya está logueado, redirigir al dashboard
                            user ? <Navigate to="/dashboard" replace /> : <Register />
                        } 
                    />
                    
                    <Route 
                        path="/login" 
                        element={
                            // Si ya está logueado, redirigir al dashboard
                            user ? <Navigate to="/dashboard" replace /> : 
                            <Login setUser={setUser} />
                        } 
                    />
                    
                    {/* RUTAS PROTEGIDAS (requieren autenticación) */}
                    <Route 
                        path="/dashboard" 
                        element={
                            user ? 
                            <Dashboard user={user} onLogout={handleLogout} /> : 
                            <Navigate to="/login" replace />
                        } 
                    />
                    
                    <Route 
                        path="/mi-perfil" 
                        element={
                            user ? 
                            <Profile user={user} setUser={setUser} /> : 
                            <Navigate to="/login" replace />
                        } 
                    />
                    
                    {/* RUTAS DE ADMINISTRADOR (requieren rol admin) */}
                    <Route 
                        path="/admin" 
                        element={
                            user?.rol === 'admin' ? 
                            <Admin user={user} onLogout={handleLogout} /> : 
                            user ? <Navigate to="/dashboard" replace /> : 
                            <Navigate to="/login" replace />
                        } 
                    />
                    
                    <Route 
                        path="/admin/usuarios" 
                        element={
                            user?.rol === 'admin' ? 
                            <AdminUsuarios user={user} /> : 
                            <Navigate to="/" replace />
                        } 
                    />
                    
                    {/* RUTA 404 - Página no encontrada */}
                    <Route 
                        path="*" 
                        element={<NotFound />} 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
```

**¿CÓMO FUNCIONA EL FLUJO?**

**1. INICIALIZACIÓN:**
```
Usuario abre la app → useEffect se ejecuta → Verifica localStorage → 
Si hay token válido → Restaura sesión → setUser(userData)
Si no hay token → user permanece null
```

**2. NAVEGACIÓN:**
```
Usuario va a /dashboard → 
Si user existe → Muestra Dashboard
Si user es null → Redirige a /login
```

**3. LOGIN:**
```
Usuario hace login → Login component llama setUser(userData) → 
App re-renderiza → Ahora user existe → Puede acceder a rutas protegidas
```

**4. LOGOUT:**
```
Usuario hace logout → handleLogout() → Limpia localStorage → 
setUser(null) → App re-renderiza → Redirige a rutas públicas
```

**¿POR QUÉ ES IMPORTANTE?**

- **SPA (Single Page Application)**: 
  - Navegación instantánea sin recargar la página
  - Mejor experiencia de usuario
  - Menos carga en el servidor

- **Estado Global**: 
  - `user` está disponible en toda la aplicación
  - Cualquier componente puede saber quién está logueado
  - Cambios en `user` actualizan toda la app automáticamente

- **Persistencia de Sesión**: 
  - Si recargas la página, sigues logueado
  - Si cierras el navegador y vuelves, sigues logueado
  - Hasta que el token expire (24 horas)

- **Protección de Rutas**: 
  - Usuarios no logueados no pueden acceder al dashboard
  - Usuarios normales no pueden acceder al panel admin
  - Redirecciones automáticas según el estado

- **Experiencia de Usuario**: 
  - Loading screen mientras verifica la sesión
  - Redirecciones inteligentes (si ya estás logueado, no te envía al login)
  - Manejo de errores en la restauración de sesión

**EJEMPLO DE FLUJO COMPLETO:**
```
1. Usuario abre sonrisitapp.com
2. App verifica localStorage → No hay token
3. Muestra Landing page
4. Usuario hace clic en "Iniciar Sesión"
5. Va a /login → Muestra formulario de login
6. Usuario ingresa email/password → Login exitoso
7. setUser({id: 1, email: 'juan@email.com', rol: 'usuario'})
8. App re-renderiza → Redirige automáticamente a /dashboard
9. Usuario ve su dashboard personalizado
10. Usuario recarga la página → useEffect restaura la sesión
11. Sigue en el dashboard sin necesidad de login
```te to="/login" />
                } />
            </Routes>
        </Router>
    );
}
```

**¿Por qué es importante?**
- Maneja estado global del usuario
- Persiste sesión al recargar página
- Protege rutas según autenticación
- Navegación sin recargar (SPA)

---

## 🎯 PREGUNTAS TÍPICAS DE EVALUACIÓN

*Estas son las preguntas más comunes que te harán en la evaluación oral. Practica las respuestas hasta que puedas explicarlas con confianza.*

### **Arquitectura**

**P: ¿Por qué separaste frontend y backend?**
**R:** Para que cada parte pueda:
- Escalarse independientemente
- Ser desarrollada por equipos diferentes
- Desplegarse en servidores diferentes
- Servir múltiples clientes (web, móvil)

### **Seguridad**

**P: ¿Cómo proteges tu aplicación?**
**R:** Con múltiples capas:
- JWT tokens para autenticación
- bcrypt para encriptar contraseñas
- Middleware que protege rutas sensibles
- Validación de entrada para prevenir inyecciones
- CORS configurado para orígenes permitidos

### **Base de Datos**

**P: ¿Por qué MySQL local y PostgreSQL en producción?**
**R:**
- MySQL: Fácil de instalar con XAMPP para desarrollo
- PostgreSQL: Más robusto y confiable para producción
- Ambos usan SQL estándar, fácil migración

**P: Explica las relaciones de tu BD**
**R:**
- usuarios → turnos (1:N): Un usuario puede tener muchos turnos
- odontologos → turnos (1:N): Un odontólogo atiende muchos turnos
- servicios → turnos (1:N): Un servicio puede estar en muchos turnos

### **React**

**P: ¿Por qué elegiste React?**
**R:**
- Componentes reutilizables
- Virtual DOM para mejor rendimiento
- Gran ecosistema de librerías
- Hooks para manejo de estado limpio
- Amplia comunidad y documentación

**P: ¿Cómo manejas el estado?**
**R:**
- useState: Estado local de componentes
- useEffect: Efectos secundarios y lifecycle
- localStorage: Persistir autenticación
- Context API: Estado global (usuario logueado)

### **Node.js**

**P: ¿Por qué Node.js?**
**R:**
- Mismo lenguaje (JavaScript) en frontend y backend
- Asíncrono: Excelente para operaciones de base de datos
- NPM: Gran ecosistema de paquetes
- Desarrollo rápido
- JSON nativo: Perfecto para APIs REST

### **Deployment**

**P: ¿Cómo desplegaste la aplicación?**
**R:**
- Backend: Render.com (gratuito, fácil configuración)
- Frontend: Vercel/Netlify (optimizado para React)
- Base de datos: PostgreSQL en Render
- Variables de entorno configuradas en cada plataforma

### **Problemas y Soluciones**

**P: ¿Qué problemas tuviste?**
**R:**
- Permisos de react-scripts: Solucionado con npm ci
- Variables de entorno diferentes en local vs producción
- CORS: Configurar orígenes permitidos
- Migración de MySQL a PostgreSQL

---

## 📝 TIPS PARA LA EVALUACIÓN

### **Antes de la evaluación:**
1. ✅ Practica explicar cada concepto en 30 segundos
2. ✅ Memoriza los 5 códigos importantes
3. ✅ Repasa las preguntas típicas
4. ✅ Prepara ejemplos simples para cada concepto

### **Durante la evaluación:**
1. ✅ Responde primero la pregunta directa
2. ✅ Luego da detalles técnicos
3. ✅ Usa ejemplos de tu proyecto
4. ✅ Si no sabes algo, sé honesto

### **Frases útiles:**
- "En mi proyecto implementé..."
- "La ventaja de esto es que..."
- "Lo elegí porque..."
- "El problema que resuelve es..."

---

## 🚀 FUNCIONALIDADES DE TU PROYECTO

### **Para Pacientes:**
- Registrarse y hacer login
- Reservar turnos disponibles
- Ver mis turnos
- Recibir notificaciones
- Actualizar perfil

### **Para Administradores:**
- Panel de control completo
- Gestionar usuarios y odontólogos
- Ver todos los turnos
- Gestionar servicios
- Ver estadísticas del sistema

### **Características Técnicas:**
- Autenticación JWT (24 horas)
- Sistema de notificaciones
- Validación de horarios
- Responsive design
- Base de datos con relaciones
- API REST completa

---

## 💡 CONCEPTOS AVANZADOS

### **Patrones de Diseño Usados:**

**1. MVC:**
- Models: Lógica de datos
- Views: Respuestas JSON
- Controllers: Lógica de negocio

**2. Middleware Pattern:**
- Cadena de funciones que procesan requests
- Autenticación → Validación → Controlador

**3. Repository Pattern:**
- Abstrae el acceso a datos
- Facilita cambios de base de datos

**4. Singleton Pattern:**
- Pool de conexiones (una sola instancia)
- Evita crear múltiples pools

### **Herramientas Utilizadas:**

**Frontend:**
- React 18, React Router, Tailwind CSS, Material Symbols, Vite

**Backend:**
- Node.js, Express.js, MySQL2, JWT, bcrypt, CORS, Helmet, Nodemon

**Deployment:**
- Render (backend), Vercel/Netlify (frontend), GitHub Actions (CI/CD)

---

¡Con esta guía tienes todo lo necesario para aprobar tu evaluación! 🎯