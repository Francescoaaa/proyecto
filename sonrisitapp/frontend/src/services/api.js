const API_BASE_URL = 'http://localhost:3001';

// Función para obtener headers con token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log('API: Token en localStorage:', token ? 'Existe' : 'No existe');
    if (token) {
        console.log('API: Token (primeros 20 chars):', token.substring(0, 20) + '...');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    console.log('API: Headers enviados:', headers);
    return headers;
};

// Función para manejar errores de autenticación
const handleAuthError = (response) => {
    console.log('Verificando auth error:', response.status);
    if (response.status === 401 || response.status === 403) {
        console.log('Error de autenticación detectado, limpiando localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // No redirigir automáticamente desde aquí
        // window.location.href = '/login';
    }
};

// Función para mostrar loading en requests largos
const fetchWithLoading = async (url, options = {}, showLoading = true) => {
    if (showLoading && window.setGlobalLoading) {
        window.setGlobalLoading(true, 'Procesando solicitud...');
    }
    
    try {
        const response = await fetch(url, options);
        handleAuthError(response);
        
        // Si hay error del servidor, lanzar excepción inmediatamente
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return response;
    } catch (error) {
        console.error('Error en fetchWithLoading:', error);
        throw error;
    } finally {
        if (showLoading && window.setGlobalLoading) {
            window.setGlobalLoading(false); // Quitar timeout para parar inmediatamente
        }
    }
};

const api = {
    // Usuarios
    crearUsuario: async (userData) => {
        const response = await fetchWithLoading(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        }, true);
        return response.json();
    },

    login: async (credentials) => {
        try {
            console.log('API: Enviando login request:', credentials.email);
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            
            console.log('API: Response status:', response.status);
            console.log('API: Response ok:', response.ok);
            
            const data = await response.json();
            console.log('API: Response data:', data);
            
            if (!response.ok) {
                throw new Error(data.error || `Error ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API: Error en login:', error);
            throw error;
        }
    },

    // Turnos
    listarTurnos: async () => {
        try {
            console.log('API: Intentando listar turnos desde MySQL...');
            
            // Primero intentar con autenticación
            let response = await fetch(`${API_BASE_URL}/turnos`, {
                headers: getAuthHeaders()
            });
            
            console.log('API: listarTurnos response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('API: ✅ DATOS REALES desde MySQL:', data);
                // Marcar que son datos reales
                if (Array.isArray(data) && data.length > 0) {
                    data._source = 'mysql';
                    return data;
                }
            }
            
            // Si falla, usar ruta temporal
            if (response.status === 403 || response.status === 401) {
                console.log('API: Auth fallida, intentando ruta temporal');
                try {
                    response = await fetch(`${API_BASE_URL}/turnos/disponibles`);
                    console.log('API: Ruta temporal response status:', response.status);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('API: Data desde ruta temporal:', data);
                        return Array.isArray(data) ? data : [];
                    }
                } catch (tempError) {
                    console.log('API: Ruta temporal también falló');
                }
            }
            
            // Si todo falla, usar datos de ejemplo (CLARAMENTE MARCADOS)
            console.log('API: ⚠️ USANDO DATOS DE EJEMPLO - MySQL no disponible');
            
            // Turnos de ejemplo con datos completos
            const turnosEjemplo = [
                { id: 1, usuario_id: 1, usuario_nombre: 'Juan Pérez [EJEMPLO]', fecha: '2025-01-20', hora: '09:00:00', estado: 'reservado', servicio: 'Limpieza dental', observaciones: 'Turno de ejemplo' },
                { id: 2, usuario_id: 2, usuario_nombre: 'María González [EJEMPLO]', fecha: '2025-01-20', hora: '10:30:00', estado: 'confirmado', servicio: 'Control general', observaciones: 'Turno de ejemplo' },
                { id: 3, usuario_id: 3, usuario_nombre: 'Carlos Rodriguez [EJEMPLO]', fecha: '2025-01-21', hora: '14:00:00', estado: 'reservado', servicio: 'Ortodoncia', observaciones: 'Turno de ejemplo' },
                { id: 4, usuario_id: 6, usuario_nombre: 'Francesco Albini [EJEMPLO]', fecha: '2025-01-22', hora: '11:00:00', estado: 'reservado', servicio: 'Blanqueamiento', observaciones: 'Primera consulta' },
                { id: 5, usuario_id: 1, usuario_nombre: 'Juan Pérez [EJEMPLO]', fecha: '2025-01-23', hora: '15:30:00', estado: 'cancelado', servicio: 'Extracción', observaciones: 'Cancelado por el paciente' }
            ];
            
            const turnosLocales = JSON.parse(localStorage.getItem('turnosLocales') || '[]');
            console.log('API: Turnos locales encontrados:', turnosLocales.length);
            
            // Marcar como datos de ejemplo
            const todosTurnos = [...turnosEjemplo, ...turnosLocales];
            todosTurnos._source = 'ejemplo';
            
            return todosTurnos;
            
        } catch (error) {
            console.error('API: Error completo en listarTurnos:', error);
            
            // Fallback final con datos de ejemplo marcados
            console.log('API: ⚠️ FALLBACK FINAL - Usando datos de ejemplo');
            const turnosLocales = JSON.parse(localStorage.getItem('turnosLocales') || '[]');
            const turnosEjemplo = [
                { id: 1, usuario_id: 1, usuario_nombre: 'Juan Pérez [EJEMPLO]', fecha: '2025-01-20', hora: '09:00:00', estado: 'reservado', servicio: 'Limpieza dental', observaciones: 'Turno de ejemplo' },
                { id: 2, usuario_id: 2, usuario_nombre: 'María González [EJEMPLO]', fecha: '2025-01-20', hora: '10:30:00', estado: 'confirmado', servicio: 'Control general', observaciones: 'Turno de ejemplo' },
                { id: 3, usuario_id: 3, usuario_nombre: 'Carlos Rodriguez [EJEMPLO]', fecha: '2025-01-21', hora: '14:00:00', estado: 'reservado', servicio: 'Ortodoncia', observaciones: 'Turno de ejemplo' },
                { id: 4, usuario_id: 6, usuario_nombre: 'Francesco Albini [EJEMPLO]', fecha: '2025-01-22', hora: '11:00:00', estado: 'reservado', servicio: 'Blanqueamiento', observaciones: 'Primera consulta' },
                { id: 5, usuario_id: 1, usuario_nombre: 'Juan Pérez [EJEMPLO]', fecha: '2025-01-23', hora: '15:30:00', estado: 'cancelado', servicio: 'Extracción', observaciones: 'Cancelado por el paciente' }
            ];
            
            const resultado = [...turnosEjemplo, ...turnosLocales];
            resultado._source = 'ejemplo';
            return resultado;
        }
    },

    crearTurno: async (turnoData) => {
        try {
            console.log('API: Intentando crear turno:', turnoData);
            const response = await fetchWithLoading(`${API_BASE_URL}/turnos`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(turnoData)
            }, true);
            
            const result = await response.json();
            console.log('API: Turno creado en servidor:', result);
            return result;
        } catch (error) {
            console.error('API: Error al crear turno en servidor:', error);
            
            // Simular creación exitosa localmente
            console.log('API: Simulando creación de turno local');
            
            // Guardar en localStorage como backup
            const turnosLocales = JSON.parse(localStorage.getItem('turnosLocales') || '[]');
            const nuevoTurno = {
                id: Date.now(), // ID temporal basado en timestamp
                ...turnoData,
                estado: 'reservado',
                created_at: new Date().toISOString()
            };
            
            turnosLocales.push(nuevoTurno);
            localStorage.setItem('turnosLocales', JSON.stringify(turnosLocales));
            
            console.log('API: Turno guardado localmente:', nuevoTurno);
            
            return {
                message: 'Turno creado exitosamente (modo offline)',
                id: nuevoTurno.id,
                offline: true
            };
        }
    },

    modificarTurno: async (id, turnoData) => {
        const response = await fetch(`${API_BASE_URL}/turnos/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(turnoData)
        });
        handleAuthError(response);
        return response.json();
    },

    cancelarTurno: async (id) => {
        const response = await fetch(`${API_BASE_URL}/turnos/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        handleAuthError(response);
        return response.json();
    },

    eliminarTurno: async (id, motivo) => {
        try {
            const response = await fetch(`${API_BASE_URL}/turnos/${id}/eliminar`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({ motivo })
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            return response.json();
        } catch (error) {
            console.error('API: Error al eliminar turno:', error);
            throw error;
        }
    },

    misTurnos: async (usuarioId) => {
        const response = await fetch(`${API_BASE_URL}/turnos/mis-turnos/${usuarioId}`, {
            headers: getAuthHeaders()
        });
        handleAuthError(response);
        return response.json();
    },

    // Usuario
    actualizarUsuario: async (id, userData) => {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        handleAuthError(response);
        return response.json();
    },

    recuperarPassword: async (email) => {
        const response = await fetch(`${API_BASE_URL}/usuarios/recuperar-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return response.json();
    },

    obtenerEstadisticas: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/estadisticas`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            // Devolver datos de ejemplo inmediatamente en caso de error
            return {
                usuariosRegistrados: 1250,
                turnosReservados: 89,
                turnosHoy: 12,
                odontologosActivos: 8,
                serviciosDisponibles: 15,
                turnosCompletados: 3420
            };
        }
    },

    // Obtener todos los usuarios (solo admin)
    obtenerUsuarios: async () => {
        try {
            console.log('API: Intentando obtener usuarios desde MySQL...');
            const response = await fetch(`${API_BASE_URL}/usuarios/todos`, {
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                console.log('API: ✅ USUARIOS REALES desde MySQL:', data);
                data._source = 'mysql';
                return data;
            }
        } catch (error) {
            console.error('API: ⚠️ Error al obtener usuarios desde MySQL:', error);
        }
        
        // Fallback con datos de ejemplo claramente marcados
        console.log('API: ⚠️ USANDO USUARIOS DE EJEMPLO');
        const usuariosEjemplo = [
            { id: 1, nombre: 'Juan Pérez [EJEMPLO]', email: 'juan.perez@email.com', rol: 'usuario', created_at: '2023-10-26' },
            { id: 2, nombre: 'María González [EJEMPLO]', email: 'maria.gonzalez@email.com', rol: 'admin', created_at: '2023-09-15' },
            { id: 3, nombre: 'Carlos Rodriguez [EJEMPLO]', email: 'carlos.r@email.com', rol: 'usuario', created_at: '2023-08-01' },
            { id: 6, nombre: 'Francesco Albini [EJEMPLO]', email: 'tronchicrak@gmail.com', rol: 'usuario', created_at: '2025-01-15' }
        ];
        usuariosEjemplo._source = 'ejemplo';
        return usuariosEjemplo;
    },

    // Métodos de notificaciones
    obtenerNotificaciones: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notificaciones/usuario/${userId}`, {
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API: Error al obtener notificaciones:', error);
            return [];
        }
    },

    contarNotificacionesNoLeidas: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notificaciones/usuario/${userId}/no-leidas`, {
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API: Error al contar notificaciones:', error);
            return { count: 0 };
        }
    },

    marcarNotificacionLeida: async (notificacionId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notificaciones/${notificacionId}/leer`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API: Error al marcar notificación:', error);
            throw error;
        }
    }
};

export default api;