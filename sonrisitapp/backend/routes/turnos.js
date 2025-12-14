const express = require('express');
const router = express.Router();
const { listarTurnos, crearTurno, modificarTurno, cancelarTurno, misTurnos, eliminarTurno } = require('../controllers/turnoController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Listar todos los turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos
 */
router.get('/', listarTurnos);

/**
 * @swagger
 * /turnos/disponibles:
 *   get:
 *     summary: Listar turnos ocupados (sin autenticación)
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos ocupados
 */
router.get('/disponibles', (req, res) => {
    console.log('TURNOS: Acceso a turnos disponibles sin auth');
    
    try {
        // Intentar obtener turnos del controlador (que usa memoria)
        const { listarTurnos } = require('../controllers/turnoController');
        
        // Simular request sin autenticación
        const mockReq = { user: null };
        const mockRes = {
            json: (data) => res.json(data),
            status: (code) => ({ json: (data) => res.status(code).json(data) })
        };
        
        // Llamar al controlador
        listarTurnos(mockReq, mockRes);
    } catch (error) {
        console.log('TURNOS: Error, usando datos fijos');
        // Fallback con datos fijos
        const turnosOcupados = [
            { fecha: '2025-01-20', hora: '09:00:00', estado: 'reservado', servicio: 'Limpieza dental' },
            { fecha: '2025-01-20', hora: '10:30:00', estado: 'confirmado', servicio: 'Control general' },
            { fecha: '2025-01-21', hora: '14:00:00', estado: 'reservado', servicio: 'Ortodoncia' }
        ];
        res.json(turnosOcupados);
    }
});

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - fecha
 *               - hora
 *               - servicio
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora:
 *                 type: string
 *                 format: time
 *               servicio:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 */
router.post('/', authenticateToken, crearTurno);

/**
 * @swagger
 * /turnos/{id}:
 *   put:
 *     summary: Modificar turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *               hora:
 *                 type: string
 *               servicio:
 *                 type: string
 *               observaciones:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Turno modificado exitosamente
 */
router.put('/:id', authenticateToken, modificarTurno);

/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Cancelar turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno cancelado exitosamente
 */
router.delete('/:id', authenticateToken, cancelarTurno);

/**
 * @swagger
 * /turnos/{id}/eliminar:
 *   delete:
 *     summary: Eliminar turno permanentemente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Turno eliminado exitosamente
 */
router.delete('/:id/eliminar', authenticateToken, requireAdmin, eliminarTurno);

/**
 * @swagger
 * /turnos/admin:
 *   get:
 *     summary: Listar todos los turnos (solo admin)
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista completa de turnos
 */
router.get('/admin', authenticateToken, requireAdmin, listarTurnos);

/**
 * @swagger
 * /turnos/mis-turnos/{usuario_id}:
 *   get:
 *     summary: Obtener turnos de un usuario específico
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de turnos del usuario
 */
router.get('/mis-turnos/:usuario_id', authenticateToken, misTurnos);

module.exports = router;