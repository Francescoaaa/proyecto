const express = require('express');
const router = express.Router();
const { listarTurnos, crearTurno, modificarTurno, cancelarTurno, misTurnos } = require('../controllers/turnoController');
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
router.get('/', authenticateToken, requireAdmin, listarTurnos);

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
 * /mis-turnos/{usuario_id}:
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