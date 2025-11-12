import React, { useState, useEffect } from 'react';

const ServerStatus = () => {
    const [status, setStatus] = useState('checking');
    const [error, setError] = useState('');

    useEffect(() => {
        checkServerStatus();
    }, []);

    const checkServerStatus = async () => {
        try {
            const response = await fetch('http://localhost:3001/', {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                setStatus('online');
                setError('');
            } else {
                setStatus('error');
                setError(`Servidor responde con error ${response.status}`);
            }
        } catch (error) {
            setStatus('offline');
            setError('No se puede conectar al servidor backend');
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'online': return 'text-green-600';
            case 'offline': return 'text-red-600';
            case 'error': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'online': return 'Servidor Online';
            case 'offline': return 'Servidor Offline';
            case 'error': return 'Error del Servidor';
            default: return 'Verificando...';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                    status === 'online' ? 'bg-green-500' : 
                    status === 'offline' ? 'bg-red-500' : 
                    status === 'error' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                </span>
                <button 
                    onClick={checkServerStatus}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                >
                    Verificar
                </button>
            </div>
            {error && (
                <div className="mt-1 text-xs text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ServerStatus;