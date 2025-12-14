const { createConnection } = require('../config/database');

// Crear notificación
const crearNotificacion = async (datos) => {
    try {
        const connection = await createConnection();
        
        const [result] = await connection.execute(
            'INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, turno_id) VALUES (?, ?, ?, ?, ?)',
            [datos.usuario_id, datos.tipo, datos.titulo, datos.mensaje, datos.turno_id || null]
        );
        
        connection.release();
        console.log('NOTIFICACION: Creada en BD:', result.insertId);
        return { id: result.insertId, ...datos };
    } catch (error) {
        console.error('Error al crear notificación:', error);
        throw error;
    }
};

// Obtener notificaciones de un usuario
const obtenerNotificaciones = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        console.log('NOTIF: Obteniendo notificaciones para usuario:', usuario_id);
        
        const connection = await createConnection();
        
        const [notificaciones] = await connection.execute(`
            SELECT n.id, n.usuario_id, n.tipo, n.titulo, n.mensaje, n.turno_id, n.leida, n.created_at
            FROM notificaciones n 
            WHERE n.usuario_id = ? 
            ORDER BY n.created_at DESC 
            LIMIT 50
        `, [usuario_id]);
        
        connection.release();
        console.log('NOTIF: Encontradas', notificaciones.length, 'notificaciones');
        res.json(notificaciones);
    } catch (error) {
        console.error('NOTIF: Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

// Marcar notificación como leída
const marcarComoLeida = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await createConnection();
        
        await connection.execute(
            'UPDATE notificaciones SET leida = TRUE WHERE id = ?',
            [id]
        );
        
        connection.release();
        res.json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        console.error('Error al marcar notificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Contar notificaciones no leídas
const contarNoLeidas = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        console.log('NOTIF: Contando no leídas para usuario:', usuario_id);
        
        const connection = await createConnection();
        
        const [result] = await connection.execute(
            'SELECT COUNT(*) as count FROM notificaciones WHERE usuario_id = ? AND leida = FALSE',
            [usuario_id]
        );
        
        connection.release();
        const count = result[0].count;
        console.log('NOTIF: Contador no leídas:', count);
        res.json({ count });
    } catch (error) {
        console.error('NOTIF: Error al contar notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

module.exports = {
    crearNotificacion,
    obtenerNotificaciones,
    marcarComoLeida,
    contarNoLeidas
};