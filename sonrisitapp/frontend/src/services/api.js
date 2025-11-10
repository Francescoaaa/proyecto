const API_BASE_URL = 'http://localhost:3001';

// Función para obtener headers con token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Función para manejar errores de autenticación
const handleAuthError = (response) => {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
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
        return response;
    } finally {
        if (showLoading && window.setGlobalLoading) {
            setTimeout(() => window.setGlobalLoading(false), 500);
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
        const response = await fetchWithLoading(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }, true);
        return response.json();
    },

    // Turnos
    listarTurnos: async () => {
        const response = await fetch(`${API_BASE_URL}/turnos`, {
            headers: getAuthHeaders()
        });
        handleAuthError(response);
        return response.json();
    },

    crearTurno: async (turnoData) => {
        const response = await fetchWithLoading(`${API_BASE_URL}/turnos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(turnoData)
        }, true);
        return response.json();
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
        const response = await fetch(`${API_BASE_URL}/usuarios/estadisticas`);
        return response.json();
    }
};

export default api;