const express = require('express');
const { obtenerNotificaciones, marcarComoLeida, contarNoLeidas } = require('../controllers/notificacionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Manejar preflight OPTIONS para CORS
router.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

// Obtener notificaciones del usuario
router.get('/usuario/:usuario_id', authenticateToken, obtenerNotificaciones);

// Contar notificaciones no leídas
router.get('/usuario/:usuario_id/no-leidas', authenticateToken, contarNoLeidas);
router.get('/usuario/:usuario_id/count', authenticateToken, contarNoLeidas);

// Marcar notificación como leída
router.put('/:id/leer', authenticateToken, marcarComoLeida);
router.put('/:id/leida', authenticateToken, marcarComoLeida);

module.exports = router;