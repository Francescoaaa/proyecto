import React from 'react';

const AuthDebug = ({ user }) => {
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('=== AUTH DEBUG ===');
        console.log('Token en localStorage:', token ? 'Existe' : 'No existe');
        console.log('User en localStorage:', userData ? 'Existe' : 'No existe');
        console.log('User en estado:', user ? 'Existe' : 'No existe');
        
        if (token && userData) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userDataParsed = JSON.parse(userData);
                
                console.log('Token payload:', payload);
                console.log('User data:', userDataParsed);
                console.log('Token expira:', new Date(payload.exp * 1000));
                console.log('Token válido:', payload.exp * 1000 > Date.now());
                
                // Verificar si hay inconsistencia entre token y user data
                if (payload.id !== userDataParsed.id) {
                    console.log('\u26a0\ufe0f INCONSISTENCIA DETECTADA:');
                    console.log('Token ID:', payload.id);
                    console.log('User ID:', userDataParsed.id);
                    console.log('Limpiando datos inconsistentes...');
                    clearAuth();
                    return;
                }
                
            } catch (error) {
                console.log('Error al decodificar token:', error);
            }
        }
        
        if (user) {
            console.log('User en estado:', user);
        }
        console.log('=================');
    };

    const clearAuth = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Auth data cleared');
        window.location.reload();
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border">
            <div className="text-xs font-bold mb-2">Auth Debug</div>
            <div className="flex gap-2">
                <button 
                    onClick={checkAuth}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                    Check Auth
                </button>
                <button 
                    onClick={clearAuth}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                    Clear Auth
                </button>
            </div>
        </div>
    );
};

export default AuthDebug;