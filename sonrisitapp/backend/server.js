const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { sanitizeInput } = require('./middleware/auth');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuarios');
const turnosRoutes = require('./routes/turnos');
const testRoutes = require('./routes/test');
const notificacionesRoutes = require('./routes/notificaciones');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middlewares
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: { error: 'Demasiadas solicitudes. Intenta nuevamente más tarde.' }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos de login por IP
    message: { error: 'Demasiados intentos de login. Intenta nuevamente en 15 minutos.' }
});

app.use(limiter);
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(sanitizeInput);

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SonrisitApp API',
            version: '1.0.0',
            description: 'API para Sistema de Gestión de Turnos Odontológicos',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Ruta específica para login con rate limiting
app.post('/login', loginLimiter, require('./controllers/usuarioController').login);

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/turnos', turnosRoutes);
app.use('/test', testRoutes);
app.use('/notificaciones', notificacionesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'SonrisitApp API funcionando correctamente',
        documentation: `http://localhost:${PORT}/api-docs`
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
    console.log(`Documentación Swagger: http://localhost:${PORT}/api-docs`);
});