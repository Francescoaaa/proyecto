import React, { useState } from 'react';

const DatabaseTest = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const testConnection = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/test/mysql');
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                status: 'error',
                message: 'Error de conexión al servidor',
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const testTables = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/test/tables');
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                status: 'error',
                message: 'Error verificando tablas',
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Test de Conexión MySQL
            </h3>
            
            <div className="flex gap-3 mb-4">
                <button
                    onClick={testConnection}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Probando...' : 'Probar Conexión'}
                </button>
                
                <button
                    onClick={testTables}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Verificando...' : 'Ver Tablas'}
                </button>
            </div>

            {result && (
                <div className={`p-4 rounded-lg ${
                    result.status === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    <h4 className="font-semibold mb-2">
                        {result.status === 'success' ? '✅ Éxito' : '❌ Error'}
                    </h4>
                    <p className="mb-2">{result.message}</p>
                    
                    {result.config && (
                        <div className="text-sm">
                            <strong>Configuración:</strong>
                            <ul className="ml-4 mt-1">
                                <li>Host: {result.config.host}</li>
                                <li>Usuario: {result.config.user}</li>
                                <li>Base de datos: {result.config.database}</li>
                            </ul>
                        </div>
                    )}
                    
                    {result.data && (
                        <div className="text-sm mt-2">
                            <strong>Datos de prueba:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    )}
                    
                    {result.tables && (
                        <div className="text-sm mt-2">
                            <strong>Tablas encontradas ({result.tables.length}):</strong>
                            <ul className="ml-4 mt-1">
                                {result.tables.map((table, index) => (
                                    <li key={index}>• {Object.values(table)[0]}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {result.error && (
                        <div className="text-sm mt-2">
                            <strong>Error técnico:</strong>
                            <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                                {result.error}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DatabaseTest;