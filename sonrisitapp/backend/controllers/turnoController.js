const { createConnection } = require('../config/database');
const { crearNotificacion } = require('./notificacionController');



const listarTurnos = async (req, res) => {
    try {
        console.log('TURNOS_BACKEND: Listando turnos para usuario:', req.user?.rol);
        
        const connection = await createConnection();
        
        try {
            if (req.user?.rol === 'admin') {
                const [turnos] = await connection.execute(`
                    SELECT t.*, u.nombre as usuario_nombre, s.nombre as servicio
                    FROM turnos t 
                    LEFT JOIN usuarios u ON t.usuario_id = u.id 
                    LEFT JOIN servicios s ON t.servicio_id = s.id
                    ORDER BY t.fecha, t.hora
                `);
                console.log('TURNOS_BACKEND: Turnos desde BD (admin):', turnos.length);
                return res.json(turnos || []);
            } else {
                const [turnos] = await connection.execute(`
                    SELECT t.fecha, t.hora, t.estado, s.nombre as servicio
                    FROM turnos t
                    LEFT JOIN servicios s ON t.servicio_id = s.id
                    WHERE t.estado IN ('reservado', 'confirmado')
                    ORDER BY t.fecha, t.hora
                `);
                console.log('TURNOS_BACKEND: Turnos desde BD (usuario):', turnos.length);
                return res.json(turnos || []);
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('TURNOS_BACKEND: Error al obtener turnos:', error);
        res.status(500).json({ error: 'Error al obtener turnos' });
    }
};

const crearTurno = async (req, res) => {
    try {
        const { usuario_id, fecha, hora, servicio, observaciones } = req.body;
        console.log('TURNOS_BACKEND: Creando turno:', { usuario_id, fecha, hora, servicio });
        
        if (!usuario_id || !fecha || !hora || !servicio) {
            return res.status(400).json({ error: 'Usuario, fecha, hora y servicio son obligatorios' });
        }

        const connection = await createConnection();
        
        // Verificar conflictos en BD
        const [conflictos] = await connection.execute(
            'SELECT id FROM turnos WHERE fecha = ? AND hora = ? AND estado IN ("reservado", "confirmado")',
            [fecha, hora]
        );
        
        if (conflictos.length > 0) {
            connection.release();
            return res.status(400).json({ error: 'Ya existe un turno reservado en esa fecha y hora' });
        }

        // Buscar el servicio_id por nombre
        const [servicioResult] = await connection.execute(
            'SELECT id FROM servicios WHERE nombre = ?',
            [servicio]
        );
        
        const servicio_id = servicioResult.length > 0 ? servicioResult[0].id : 1;
        
        const [result] = await connection.execute(
            'INSERT INTO turnos (usuario_id, servicio_id, fecha, hora, observaciones, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, servicio_id, fecha, hora, observaciones, 'reservado']
        );
        
        const turnoId = result.insertId;
        console.log('TURNOS_BACKEND: Turno creado en BD con ID:', turnoId);
        
        // Crear notificación para administradores
        try {
            const [admins] = await connection.execute(
                'SELECT id FROM usuarios WHERE rol = "admin"'
            );
            
            for (const admin of admins) {
                await crearNotificacion({
                    usuario_id: admin.id,
                    tipo: 'nuevo_turno',
                    titulo: 'Nuevo Turno Reservado',
                    mensaje: `Se ha reservado un nuevo turno para el ${fecha} a las ${hora} - ${servicio}`,
                    turno_id: turnoId
                });
            }
            console.log('TURNOS_BACKEND: Notificaciones para admins creadas');
        } catch (notifError) {
            console.log('TURNOS_BACKEND: Error al crear notificaciones:', notifError.message);
        }
        
        connection.release();
        res.status(201).json({ message: 'Turno creado exitosamente', id: turnoId });
    } catch (error) {
        console.error('TURNOS_BACKEND: Error al crear turno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const modificarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, hora, servicio, observaciones, estado } = req.body;
        console.log('TURNOS_BACKEND: Modificando turno:', id);
        
        const connection = await createConnection();
        
        // Verificar que el turno existe
        const [turnos] = await connection.execute('SELECT * FROM turnos WHERE id = ?', [id]);
        if (turnos.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        
        const turno = turnos[0];
        
        let servicio_id = null;
        if (servicio) {
            const [servicioResult] = await connection.execute(
                'SELECT id FROM servicios WHERE nombre = ?',
                [servicio]
            );
            servicio_id = servicioResult.length > 0 ? servicioResult[0].id : null;
        }
        
        // Construir query dinámicamente
        let query = 'UPDATE turnos SET ';
        let params = [];
        let updates = [];
        
        if (fecha) { updates.push('fecha = ?'); params.push(fecha); }
        if (hora) { updates.push('hora = ?'); params.push(hora); }
        if (servicio_id) { updates.push('servicio_id = ?'); params.push(servicio_id); }
        if (observaciones !== undefined) { updates.push('observaciones = ?'); params.push(observaciones); }
        if (estado) { updates.push('estado = ?'); params.push(estado); }
        
        query += updates.join(', ') + ' WHERE id = ?';
        params.push(id);
        
        await connection.execute(query, params);
        console.log('TURNOS_BACKEND: Turno modificado en BD');
        
        // Crear notificación si cambió el estado
        if (estado && turno.usuario_id) {
            let notificacionData = null;
            
            if (estado === 'cancelado') {
                notificacionData = {
                    usuario_id: turno.usuario_id,
                    tipo: 'turno_cancelado',
                    titulo: 'Turno Cancelado',
                    mensaje: `Tu turno del ${turno.fecha} a las ${turno.hora} ha sido cancelado. ${observaciones || ''}`,
                    turno_id: turno.id
                };
            } else if (fecha && hora) {
                notificacionData = {
                    usuario_id: turno.usuario_id,
                    tipo: 'turno_pospuesto',
                    titulo: 'Turno Reprogramado',
                    mensaje: `Tu turno ha sido reprogramado para el ${fecha} a las ${hora}. ${observaciones || ''}`,
                    turno_id: turno.id
                };
            }
            
            if (notificacionData) {
                try {
                    await crearNotificacion(notificacionData);
                    console.log('TURNOS_BACKEND: Notificación creada');
                } catch (notifError) {
                    console.log('TURNOS_BACKEND: Error al crear notificación:', notifError.message);
                }
            }
        }
        
        connection.release();
        res.json({ message: 'Turno modificado exitosamente' });
    } catch (error) {
        console.error('TURNOS_BACKEND: Error al modificar turno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const cancelarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('TURNOS_BACKEND: Cancelando turno:', id);
        
        const connection = await createConnection();
        
        const [result] = await connection.execute(
            'UPDATE turnos SET estado = "cancelado" WHERE id = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        
        connection.release();
        console.log('TURNOS_BACKEND: Turno cancelado en BD');
        res.json({ message: 'Turno cancelado exitosamente' });
    } catch (error) {
        console.error('TURNOS_BACKEND: Error al cancelar turno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const eliminarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        console.log('TURNOS_BACKEND: Eliminando turno:', id, 'Motivo:', motivo);
        
        const connection = await createConnection();
        
        // Obtener datos del turno antes de eliminarlo
        const [turnos] = await connection.execute('SELECT * FROM turnos WHERE id = ?', [id]);
        
        if (turnos.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        
        const turnoEliminado = turnos[0];
        
        const [result] = await connection.execute(
            'DELETE FROM turnos WHERE id = ?',
            [id]
        );
        
        connection.release();
        console.log('TURNOS_BACKEND: Turno eliminado de BD');
        
        res.json({ 
            message: 'Turno eliminado exitosamente',
            motivo: motivo,
            turno: turnoEliminado
        });
    } catch (error) {
        console.error('TURNOS_BACKEND: Error al eliminar turno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const misTurnos = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        console.log('TURNOS_BACKEND: Obteniendo turnos para usuario:', usuario_id);
        
        const connection = await createConnection();
        
        try {
            const [turnos] = await connection.execute(`
                SELECT t.*, s.nombre as servicio
                FROM turnos t 
                LEFT JOIN servicios s ON t.servicio_id = s.id
                WHERE t.usuario_id = ? 
                ORDER BY t.fecha, t.hora
            `, [usuario_id]);
            
            console.log('TURNOS_BACKEND: Turnos desde BD para usuario:', turnos.length);
            res.json(turnos || []);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('TURNOS_BACKEND: Error al obtener mis turnos:', error);
        res.status(500).json({ error: 'Error al obtener turnos' });
    }
};

module.exports = { listarTurnos, crearTurno, modificarTurno, cancelarTurno, misTurnos, eliminarTurno };