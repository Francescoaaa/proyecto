const express = require('express');
const { obtenerNotificaciones, marcarComoLeida, contarNoLeidas } = require('../controllers/notificacionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener notificaciones del usuario
router.get('/usuario/:usuario_id', authenticateToken, obtenerNotificaciones);

// Contar notificaciones no leídas
router.get('/usuario/:usuario_id/no-leidas', authenticateToken, contarNoLeidas);
router.get('/usuario/:usuario_id/count', authenticateToken, contarNoLeidas);

// Marcar notificación como leída
router.put('/:id/leer', authenticateToken, marcarComoLeida);
router.put('/:id/leida', authenticateToken, marcarComoLeida);

module.exports = router;