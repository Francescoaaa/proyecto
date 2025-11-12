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

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('AUTH_MIDDLEWARE: Error al verificar token:', err.message);
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }
        
        console.log('AUTH_MIDDLEWARE: Token válido para usuario:', user.email, 'rol:', user.rol, 'id:', user.id);
        
        // Si es usuario temporal (ID 999), permitir acceso
        if (user.id === 999) {
            console.log('AUTH_MIDDLEWARE: Usuario temporal detectado, acceso permitido');
            req.user = user;
            return next();
        }
        
        req.user = user;
        next();
    });
};

// Middleware para verificar rol de administrador
const requireAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador' });
    }
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