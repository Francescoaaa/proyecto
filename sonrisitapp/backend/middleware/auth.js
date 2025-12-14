const jwt = require('jsonwebtoken');

// Middleware de autenticación JWT
const authenticateToken = (req, res, next) => {
    console.log('AUTH_MIDDLEWARE: Verificando autenticación para:', req.method, req.path);
    
    const authHeader = req.headers['authorization'];
    console.log('AUTH_MIDDLEWARE: Authorization header:', authHeader ? 'Presente' : 'Ausente');
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('AUTH_MIDDLEWARE: Token extraído:', token ? 'Sí' : 'No');

    if (!token) {
        console.log('AUTH_MIDDLEWARE: Token no encontrado, devolviendo 401');
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    // Verificar que JWT_SECRET existe
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET no está definido');
        return res.status(500).json({ error: 'Error de configuración del servidor' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('AUTH_MIDDLEWARE: Error al verificar token:', err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expirado', expired: true });
            }
            return res.status(403).json({ error: 'Token inválido' });
        }
        
        console.log('AUTH_MIDDLEWARE: Token válido para usuario:', user.email, 'rol:', user.rol, 'id:', user.id);
        console.log('AUTH_MIDDLEWARE: Datos completos del usuario:', JSON.stringify(user, null, 2));
        
        req.user = user;
        next();
    });
};

// Middleware para verificar rol de administrador
const requireAdmin = (req, res, next) => {
    console.log('REQUIRE_ADMIN: Verificando permisos para usuario:', req.user?.email, 'rol:', req.user?.rol);
    console.log('REQUIRE_ADMIN: Objeto user completo:', JSON.stringify(req.user, null, 2));
    
    if (!req.user) {
        console.log('REQUIRE_ADMIN: No hay usuario en req.user');
        return res.status(403).json({ error: 'Usuario no autenticado' });
    }
    
    if (req.user.rol !== 'admin') {
        console.log('REQUIRE_ADMIN: Acceso denegado - rol requerido: admin, rol actual:', req.user.rol);
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador' });
    }
    
    console.log('REQUIRE_ADMIN: Acceso permitido para admin');
    next();
};

// Validación de entrada para prevenir inyecciones
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                // Remover caracteres peligrosos
                obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                obj[key] = obj[key].replace(/javascript:/gi, '');
                obj[key] = obj[key].replace(/on\w+\s*=/gi, '');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };
    
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    sanitizeInput
};