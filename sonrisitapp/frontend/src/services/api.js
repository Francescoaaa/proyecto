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
            console.log('API: Obteniendo turnos desde MySQL...');
            const response = await fetch(`${API_BASE_URL}/turnos`, {
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API: Turnos obtenidos:', data.length);
            return data;
        } catch (error) {
            console.error('API: Error al obtener turnos:', error);
            throw error;
        }
    },

    crearTurno: async (turnoData) => {
        console.log('API: Creando turno:', turnoData);
        const response = await fetchWithLoading(`${API_BASE_URL}/turnos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(turnoData)
        }, true);
        
        const result = await response.json();
        console.log('API: Turno creado:', result);
        return result;
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
        try {
            console.log('API: Obteniendo mis turnos para usuario:', usuarioId);
            const response = await fetch(`${API_BASE_URL}/turnos/mis-turnos/${usuarioId}`, {
                headers: getAuthHeaders()
            });
            
            console.log('API: Response status:', response.status);
            console.log('API: Response ok:', response.ok);
            
            handleAuthError(response);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API: Turnos recibidos:', data);
            return data;
        } catch (error) {
            console.error('API: Error en misTurnos:', error);
            throw error;
        }
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
        const response = await fetch(`${API_BASE_URL}/usuarios/estadisticas`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    },

    // Obtener todos los usuarios (solo admin)
    obtenerUsuarios: async () => {
        console.log('API: Obteniendo usuarios desde MySQL...');
        const response = await fetch(`${API_BASE_URL}/usuarios/todos`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API: Usuarios obtenidos:', data.length);
        return data;
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
    },

    // Preferencias de notificaciones
    actualizarPreferenciasNotificaciones: async (userId, preferences) => {
        const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/notificaciones`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(preferences)
        });
        handleAuthError(response);
        return response.json();
    },

    // Eliminar cuenta
    eliminarCuenta: async (userId, confirmEmail) => {
        const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/eliminar`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ confirmEmail })
        });
        handleAuthError(response);
        return response.json();
    }
};

export default api;