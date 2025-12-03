const express = require('express');
const router = express.Router();
const { crearUsuario, login, actualizarUsuario, recuperarPassword, obtenerEstadisticas, obtenerTodosUsuarios, actualizarPreferenciasNotificaciones, eliminarCuenta } = require('../controllers/usuarioController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en los datos enviados
 */
router.post('/', crearUsuario);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', login);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
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
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', authenticateToken, actualizarUsuario);

/**
 * @swagger
 * /usuarios/recuperar-password:
 *   post:
 *     summary: Recuperar contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña temporal generada
 *       404:
 *         description: Email no encontrado
 */
router.post('/recuperar-password', recuperarPassword);

/**
 * @swagger
 * /usuarios/estadisticas:
 *   get:
 *     summary: Obtener estadísticas del sistema
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
router.get('/estadisticas', obtenerEstadisticas);

/**
 * @swagger
 * /usuarios/todos:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 */
router.get('/todos', obtenerTodosUsuarios);

/**
 * @swagger
 * /usuarios/{id}/notificaciones:
 *   put:
 *     summary: Actualizar preferencias de notificaciones
 *     tags: [Usuarios]
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
 *               email_notifications:
 *                 type: boolean
 *               promo_notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferencias actualizadas exitosamente
 */
router.put('/:id/notificaciones', authenticateToken, actualizarPreferenciasNotificaciones);

/**
 * @swagger
 * /usuarios/{id}/eliminar:
 *   delete:
 *     summary: Eliminar cuenta de usuario
 *     tags: [Usuarios]
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
 *             required:
 *               - confirmEmail
 *             properties:
 *               confirmEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cuenta eliminada exitosamente
 *       400:
 *         description: Email de confirmación incorrecto
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id/eliminar', authenticateToken, eliminarCuenta);

module.exports = router;