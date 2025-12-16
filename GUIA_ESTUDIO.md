# 📚 GUÍA DE ESTUDIO - SonrisitApp
<!-- Autor: Francesco - https://github.com/Francescoaaa -->

## 🎯 CONCEPTOS BÁSICOS PARA MEMORIZAR

### ¿Qué es React?
**RESPUESTA CORTA:** React es una librería de JavaScript para crear interfaces de usuario con componentes reutilizables.

**PUNTOS CLAVE:**
- ✅ **Componentes**: Bloques reutilizables como LEGO
- ✅ **Virtual DOM**: Actualiza solo lo que cambió
- ✅ **JSX**: HTML dentro de JavaScript
- ✅ **Hooks**: useState, useEffect para estado y efectos
- ✅ **Unidireccional**: Datos fluyen de padre a hijo

### ¿Qué es Node.js?
**RESPUESTA CORTA:** Node.js permite usar JavaScript en el servidor, no solo en el navegador.

**PUNTOS CLAVE:**
- ✅ **JavaScript en backend**: Un solo lenguaje para todo
- ✅ **Asíncrono**: Maneja múltiples usuarios simultáneamente
- ✅ **NPM**: Millones de paquetes disponibles
- ✅ **Event-driven**: Basado en eventos
- ✅ **JSON nativo**: Perfecto para APIs REST

### ¿Qué es Express?
**RESPUESTA CORTA:** Express simplifica crear APIs en Node.js.

**FUNCIONES PRINCIPALES:**
- ✅ **Routing**: Define rutas (GET, POST, PUT, DELETE)
- ✅ **Middleware**: Funciones que procesan requests
- ✅ **Manejo de errores**: Sistema centralizado
- ✅ **Menos código**: 10 líneas vs 50+ en Node.js puro

### ¿Qué es una API?
**RESPUESTA CORTA:** Una API es como un mesero que lleva pedidos entre el frontend y la base de datos.

**ANALOGÍA DEL RESTAURANTE:**
- **Cliente (Frontend)**: Tú en el restaurante
- **Mesero (API)**: Lleva pedidos y trae comida
- **Cocina (Backend)**: Prepara la comida

### ¿Qué es MVC?
**RESPUESTA CORTA:** MVC separa la aplicación en 3 partes: Modelo (datos), Vista (presentación), Controlador (lógica).

**COMPONENTES:**
- **Model**: Maneja datos y base de datos
- **View**: Presenta información (JSON en APIs)
- **Controller**: Coordina entre Model y View

### ¿Qué es una API Key?
**RESPUESTA CORTA:** Una API Key es como una llave que identifica quién usa la API.

**TIPOS:**
- **API Key simple**: String estático
- **JWT Token**: Contiene información y expira
- **OAuth**: Para servicios de terceros (Google, Facebook)

---

## 🔥 CÓDIGOS IMPORTANTES PARA MEMORIZAR

### 1. Autenticación JWT - El Guardia de Seguridad
```javascript
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};
```

### 2. Pool de Conexiones - Administrador de BD
```javascript
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    waitForConnections: true
});

const createConnection = async () => {
    return await pool.promise().getConnection();
};
```

### 3. API Service - Comunicador Frontend
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

const api = {
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return response.json();
    }
};
```

### 4. Controlador de Turnos - Cerebro del Sistema
```javascript
const crearTurno = async (req, res) => {
    const { usuario_id, fecha, hora, servicio_id } = req.body;
    let connection;
    
    try {
        connection = await createConnection();
        
        // Verificar disponibilidad
        const [existing] = await connection.execute(
            'SELECT * FROM turnos WHERE fecha = ? AND hora = ? AND odontologo_id = ?',
            [fecha, hora, odontologo_id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Horario no disponible' });
        }
        
        // Crear turno
        const [result] = await connection.execute(
            'INSERT INTO turnos (usuario_id, fecha, hora, servicio_id) VALUES (?, ?, ?, ?)',
            [usuario_id, fecha, hora, servicio_id]
        );
        
        res.status(201).json({ id: result.insertId, message: 'Turno creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    } finally {
        if (connection) connection.release();
    }
};
```

### 5. App React - Director de Orquesta
```javascript
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
                <Route path="/login" element={
                    user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
                } />
                <Route path="/dashboard" element={
                    user ? <Dashboard user={user} /> : <Navigate to="/login" />
                } />
                <Route path="/admin" element={
                    user?.rol === 'admin' ? <Admin /> : <Navigate to="/" />
                } />
            </Routes>
        </Router>
    );
}
```

---

## 🎯 PREGUNTAS TÍPICAS DE EVALUACIÓN

### **Arquitectura**
**P: ¿Por qué separaste frontend y backend?**
**R:** Para escalabilidad independiente, desarrollo en paralelo, deployment separado y servir múltiples clientes.

### **Seguridad**
**P: ¿Cómo proteges tu aplicación?**
**R:** JWT tokens, bcrypt para passwords, middleware de autenticación, validación de entrada y CORS configurado.

### **Base de Datos**
**P: ¿Por qué MySQL local y PostgreSQL en producción?**
**R:** MySQL es fácil con XAMPP para desarrollo, PostgreSQL es más robusto para producción.

### **React**
**P: ¿Por qué elegiste React?**
**R:** Componentes reutilizables, Virtual DOM, gran ecosistema, hooks para estado limpio.

### **Node.js**
**P: ¿Por qué Node.js?**
**R:** Mismo lenguaje en frontend y backend, asíncrono, NPM, JSON nativo.

---

## 📝 TIPS PARA LA EVALUACIÓN

### **Antes:**
- Practica explicar conceptos en 30 segundos
- Memoriza los 5 códigos importantes
- Prepara ejemplos de tu proyecto

### **Durante:**
- Responde directo, luego da detalles
- Usa frases como "En mi proyecto implementé..."
- Sé honesto si no sabes algo

---

## 🚀 FUNCIONALIDADES DEL PROYECTO

### **Pacientes:**
- Login/registro, reservar turnos, ver mis turnos, notificaciones

### **Administradores:**
- Panel completo, gestionar usuarios/odontólogos, ver todos los turnos

### **Técnicas:**
- JWT (24h), notificaciones, validación horarios, responsive, API REST

---

## 💡 HERRAMIENTAS UTILIZADAS

**Frontend:** React 18, React Router, Tailwind CSS, Vite
**Backend:** Node.js, Express.js, MySQL2, JWT, bcrypt
**Deployment:** Render (backend), Vercel (frontend)

---

¡Con esta guía tienes todo lo esencial para tu evaluación! 🎯