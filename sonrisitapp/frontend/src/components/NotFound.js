// Autor: Francesco - https://github.com/Francescoaaa
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md">
                <span className="material-symbols-outlined text-8xl text-gray-400 mb-4">search_off</span>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Página no encontrada
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    La página que buscas no existe o ha sido movida.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Volver
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;