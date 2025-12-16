// Autor: Francesco - https://github.com/Francescoaaa
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const RecuperarPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await api.recuperarPassword(email);
            if (response.tempPassword) {
                setMessage(`Tu nueva contraseña temporal es: ${response.tempPassword}. Úsala para iniciar sesión y luego cámbiala desde tu perfil.`);
            } else {
                setMessage('Se ha generado una nueva contraseña temporal.');
            }
        } catch (error) {
            setError('Error al procesar la solicitud. Verifica que el email sea correcto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white dark:bg-gray-900/50 shadow-lg">
                        <div className="p-8 sm:p-12">
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary text-4xl">
                                        clinical_notes
                                    </span>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sonrisitapp</h1>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Recuperar Contraseña</h2>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Ingresa tu email y te enviaremos una nueva contraseña temporal.
                                </p>
                            </div>

                            {message && (
                                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium leading-normal pb-2 text-gray-900 dark:text-gray-200" htmlFor="email">
                                        Correo Electrónico
                                    </label>
                                    <div className="flex w-full items-stretch rounded-lg">
                                        <input 
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 rounded-r-none border-r-0 text-base font-normal leading-normal"
                                            id="email" 
                                            name="email"
                                            placeholder="tu.correo@ejemplo.com" 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <div className="text-gray-400 dark:text-gray-500 flex border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark items-center justify-center pr-3 rounded-r-lg border-l-0">
                                            <span className="material-symbols-outlined">mail</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark disabled:opacity-50"
                                >
                                    <span className="truncate">
                                        {loading ? 'Enviando...' : 'Enviar Nueva Contraseña'}
                                    </span>
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link className="font-medium text-primary hover:text-primary/80" to="/login">
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RecuperarPassword;