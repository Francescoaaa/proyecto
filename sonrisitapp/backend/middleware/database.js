const { isDatabaseAvailable } = require('../config/database');

// Middleware para verificar disponibilidad de la base de datos
const checkDatabaseConnection = async (req, res, next) => {
    try {
        const isAvailable = await isDatabaseAvailable();
        
        if (!isAvailable) {
            console.log('DATABASE_MIDDLEWARE: Base de datos no disponible');
            return res.status(503).json({ 
                error: 'Servicio temporalmente no disponible',
                message: 'La base de datos no está disponible en este momento. Por favor, intenta más tarde.',
                code: 'DATABASE_UNAVAILABLE'
            });
        }
        
        next();
    } catch (error) {
        console.error('DATABASE_MIDDLEWARE: Error verificando conexión:', error);
        return res.status(503).json({ 
            error: 'Servicio temporalmente no disponible',
            message: 'Error al verificar la conexión con la base de datos.',
            code: 'DATABASE_CHECK_ERROR'
        });
    }
};

module.exports = { checkDatabaseConnection };