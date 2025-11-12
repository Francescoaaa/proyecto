const { createConnection } = require('../config/database');
const { crearNotificacion } = require('./notificacionController');

// Almacenamiento temporal en memoria (se pierde al reiniciar servidor)
let turnosEnMemoria = [
    { id: 1, usuario_id: 1, usuario_nombre: 'Juan Pérez', fecha: '2025-01-20', hora: '09:00:00', servicio: 'Limpieza dental', estado: 'reservado', observaciones: 'Turno de ejemplo', created_at: '2025-01-15T10:00:00Z' },
    { id: 2, usuario_id: 2, usuario_nombre: 'María González', fecha: '2025-01-20', hora: '10:30:00', servicio: 'Control general', estado: 'confirmado', observaciones: 'Turno de ejemplo', created_at: '2025-01-16T14:30:00Z' },
    { id: 3, usuario_id: 3, usuario_nombre: 'Carlos Rodriguez', fecha: '2025-01-21', hora: '14:00:00', servicio: 'Ortodoncia', estado: 'reservado', observaciones: 'Turno de ejemplo', created_at: '2025-01-17T09:15:00Z' },
    { id: 4, usuario_id: 6, usuario_nombre: 'Francesco Albini', fecha: '2025-01-22', hora: '11:00:00', servicio: 'Blanqueamiento', estado: 'reservado', observaciones: 'Primera consulta', created_at: '2025-01-18T16:45:00Z' },
    { id: 5, usuario_id: 1, usuario_nombre: 'Juan Pérez', fecha: '2025-01-23', hora: '15:30:00', servicio: 'Extracción', estado: 'cancelado', observaciones: 'Cancelado por el paciente', created_at: '2025-01-19T11:20:00Z' }
];

let nextId = 6;

const listarTurnos = async (req, res) => {
    try {
        console.log('TURNOS_BACKEND: Listando turnos para usuario:', req.user?.rol);
        
        // Intentar obtener de la base de datos primero
        try {
            const connection = await createConnection();
            
            if (req.user?.rol === 'admin') {
                const [turnos] = await connection.execute(`
                    SELECT t.*, u.nombre as usuario_nombre
                    FROM turnos t 
                    LEFT JOIN usuarios u ON t.usuario_id = u.id 
                    ORDER BY t.fecha, t.hora
                `);
                await connection.end();
                console.log('TURNOS_BACKEND: Turnos desde BD (admin):', turnos.length);
                return res.json(turnos || []);
            } else {
                const [turnos] = await connection.execute(`
                    SELECT fecha, hora, estado, servicio
                    FROM turnos 
                    WHERE estado IN ('reservado', 'confirmado')
                    ORDER BY fecha, hora
                `);
                await connection.end();
                console.log('TURNOS_BACKEND: Turnos desde BD (usuario):', turnos.length);
                return res.json(turnos || []);
            }
        } catch (dbError) {
            console.log('TURNOS_BACKEND: Error BD, usando memoria:', dbError.message);
        }
        
        // Si falla la BD, usar memoria
        const turnosFiltrados = req.user?.rol === 'admin' 
            ? turnosEnMemoria.map(t => ({
                ...t,
                usuario_nombre: t.usuario_nombre || 'Usuario Desconocido'
              }))
            : turnosEnMemoria
                .filter(t => ['reservado', 'confirmado'].includes(t.estado))
                .map(t => ({ fecha: t.fecha, hora: t.hora, estado: t.estado, servicio: t.servicio }));
        
        console.log('TURNOS_BACKEND: Turnos desde memoria:', turnosFiltrados.length);
        res.json(turnosFiltrados);
    } catch (error) {
        console.error('TURNOS_BACKEND: Error general:', error);
        res.json([]);
    }
};

const crearTurno = async (req, res) => {
    try {
        const { usuario_id, fecha, hora, servicio, observaciones } = req.body;
        console.log('TURNOS_BACKEND: Creando turno:', { usuario_id, fecha, hora, servicio });
        
        if (!usuario_id || !fecha || !hora || !servicio) {
            return res.status(400).json({ error: 'Usuario, fecha, hora y servicio son obligatorios' });
        }

        // Verificar conflictos en memoria
        const conflictoMemoria = turnosEnMemoria.some(t => 
            t.fecha === fecha && t.hora === hora && ['reservado', 'confirmado'].includes(t.estado)
        );
        
        if (conflictoMemoria) {
            return res.status(400).json({ error: 'Ya existe un turno reservado en esa fecha y hora' });
        }

        // Obtener nombre del usuario (simulado)
        const usuariosEjemplo = {
            1: 'Juan Pérez',
            2: 'María González', 
            3: 'Carlos Rodriguez',
            6: 'Francesco Albini'
        };
        
        // Crear turno en memoria
        const nuevoTurno = {
            id: nextId++,
            usuario_id: parseInt(usuario_id),
            usuario_nombre: usuariosEjemplo[usuario_id] || `Usuario ${usuario_id}`,
            fecha,
            hora,
            servicio,
            observaciones: observaciones || '',
            estado: 'reservado',
            created_at: new Date().toISOString()
        };
        
        turnosEnMemoria.push(nuevoTurno);
        console.log('TURNOS_BACKEND: Turno creado en memoria con ID:', nuevoTurno.id);
        
        // Intentar guardar en BD también (opcional)
        try {
            const connection = await createConnection();
            const [result] = await connection.execute(
                'INSERT INTO turnos (usuario_id, fecha, hora, servicio, observaciones, estado) VALUES (?, ?, ?, ?, ?, ?)',
                [usuario_id, fecha, hora, servicio, observaciones, 'reservado']
            );
            await connection.end();
            console.log('TURNOS_BACKEND: Turno también guardado en BD');
            
            // Crear notificación para administradores
            try {
                // Obtener todos los administradores
                const [admins] = await connection.execute(
                    'SELECT id FROM usuarios WHERE rol = "admin"'
                );
                
                // Crear notificación para cada admin
                for (const admin of admins) {
                    await crearNotificacion({
                        usuario_id: admin.id,
                        tipo: 'nuevo_turno',
                        titulo: 'Nuevo Turno Reservado',
                        mensaje: `Se ha reservado un nuevo turno para el ${fecha} a las ${hora} - ${servicio}`,
                        turno_id: nuevoTurno.id
                    });
                }
                console.log('TURNOS_BACKEND: Notificaciones para admins creadas');
            } catch (notifError) {
                console.log('TURNOS_BACKEND: Error al crear notificaciones:', notifError.message);
            }
        } catch (dbError) {
            console.log('TURNOS_BACKEND: No se pudo guardar en BD, pero está en memoria');
        }
        
        res.status(201).json({ message: 'Turno creado exitosamente', id: nuevoTurno.id });
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
        
        // Buscar en memoria
        const turnoIndex = turnosEnMemoria.findIndex(t => t.id === parseInt(id));
        
        if (turnoIndex === -1) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        
        // Modificar en memoria
        if (fecha) turnosEnMemoria[turnoIndex].fecha = fecha;
        if (hora) turnosEnMemoria[turnoIndex].hora = hora;
        if (servicio) turnosEnMemoria[turnoIndex].servicio = servicio;
        if (observaciones !== undefined) turnosEnMemoria[turnoIndex].observaciones = observaciones;
        if (estado) turnosEnMemoria[turnoIndex].estado = estado;
        turnosEnMemoria[turnoIndex].updated_at = new Date().toISOString();
        
        console.log('TURNOS_BACKEND: Turno modificado en memoria');
        
        // Intentar modificar en BD también
        try {
            const connection = await createConnection();
            const [result] = await connection.execute(
                'UPDATE turnos SET fecha = ?, hora = ?, servicio = ?, observaciones = ?, estado = ? WHERE id = ?',
                [fecha, hora, servicio, observaciones, estado, id]
            );
            await connection.end();
            console.log('TURNOS_BACKEND: Turno también modificado en BD');
            
            // Crear notificación si cambió el estado
            if (estado && turnosEnMemoria[turnoIndex].usuario_id) {
                const turno = turnosEnMemoria[turnoIndex];
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
        } catch (dbError) {
            console.log('TURNOS_BACKEND: No se pudo modificar en BD, pero está en memoria');
        }
        
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
        
        // Buscar en memoria
        const turnoIndex = turnosEnMemoria.findIndex(t => t.id === parseInt(id));
        
        if (turnoIndex === -1) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        
        // Cancelar en memoria
        turnosEnMemoria[turnoIndex].estado = 'cancelado';
        turnosEnMemoria[turnoIndex].updated_at = new Date().toISOString();
        
        console.log('TURNOS_BACKEND: Turno cancelado en memoria');
        
        // Intentar cancelar en BD también
        try {
            const connection = await createConnection();
            const [result] = await connection.execute(
                'UPDATE turnos SET estado = "cancelado" WHERE id = ?',
                [id]
            );
            await connection.end();
            console.log('TURNOS_BACKEND: Turno también cancelado en BD');
        } catch (dbError) {
            console.log('TURNOS_BACKEND: No se pudo cancelar en BD, pero está en memoria');
        }
        
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
        
        // Buscar en memoria
        const turnoIndex = turnosEnMemoria.findIndex(t => t.id === parseInt(id));
        
        if (turnoIndex === -1) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        
        // Eliminar de memoria
        const turnoEliminado = turnosEnMemoria.splice(turnoIndex, 1)[0];
        console.log('TURNOS_BACKEND: Turno eliminado de memoria');
        
        // Intentar eliminar de BD también
        try {
            const connection = await createConnection();
            const [result] = await connection.execute(
                'DELETE FROM turnos WHERE id = ?',
                [id]
            );
            await connection.end();
            console.log('TURNOS_BACKEND: Turno también eliminado de BD');
        } catch (dbError) {
            console.log('TURNOS_BACKEND: No se pudo eliminar de BD, pero está eliminado de memoria');
        }
        
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
        
        // Intentar BD primero
        try {
            const connection = await createConnection();
            const [turnos] = await connection.execute(`
                SELECT t.*
                FROM turnos t 
                WHERE t.usuario_id = ? 
                ORDER BY t.fecha, t.hora
            `, [usuario_id]);
            await connection.end();
            console.log('TURNOS_BACKEND: Turnos desde BD para usuario:', turnos.length);
            return res.json(turnos || []);
        } catch (dbError) {
            console.log('TURNOS_BACKEND: Error BD, usando memoria para mis turnos');
        }
        
        // Si falla BD, usar memoria
        const misTurnosMemoria = turnosEnMemoria.filter(t => t.usuario_id === parseInt(usuario_id));
        console.log('TURNOS_BACKEND: Turnos desde memoria para usuario:', misTurnosMemoria.length);
        res.json(misTurnosMemoria);
    } catch (error) {
        console.error('TURNOS_BACKEND: Error al obtener mis turnos:', error);
        res.json([]);
    }
};

module.exports = { listarTurnos, crearTurno, modificarTurno, cancelarTurno, misTurnos, eliminarTurno };