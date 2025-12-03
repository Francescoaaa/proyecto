import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        try {
            const userData = {
                nombre: `${formData.nombre} ${formData.apellido}`,
                email: formData.email,
                password: formData.password,
                telefono: formData.telefono
            };
            
            const response = await api.crearUsuario(userData);
            
            if (response.message && response.id) {
                setSuccess('Usuario registrado exitosamente');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.error || 'Error al registrar usuario');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <div className="flex flex-1 justify-center items-center p-4 lg:p-8">
                    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-900/50 rounded-xl shadow-lg overflow-hidden md:grid md:grid-cols-2">
                        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-primary/10 dark:bg-primary/20">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary text-5xl">health_and_safety</span>
                                <span className="text-3xl font-bold text-gray-800 dark:text-white">Sonrisitapp</span>
                            </div>
                            <img 
                                className="rounded-lg object-cover w-full h-auto max-w-md" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDInYnl5nRHDjVqdnQF3CgSLEuv1tmVfp5aXrWLaIPaM9HNE6GXBtr8j9AaC4Ghwao45vS4sBJ3DVAZYS1lBzggpZprIc7BDomqo1lhgOxydQU_MCA2rJtAltSIEYW0xSRsDP4Q0ucCEwrEIx_7d7ZPabQ_V0_tjdu84ehQ_-UritAhSIjXWYHfTwkKkCiGi35lYglNZ6y5v0EyQc8VlHH_2gTAr7Mnrvm2DBbRvs3Et1PTTXQV9nDsOtUGEtIdh6udV3G3t_2I-mA" 
                                alt="A friendly dentist consulting with a patient in a bright, modern clinic"
                            />
                            <p className="text-center mt-6 text-gray-600 dark:text-gray-300 max-w-sm">
                                Cuidamos tu sonrisa, agendando tus turnos de manera simple y eficiente.
                            </p>
                        </div>
                        
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="w-full max-w-md mx-auto">
                                <div className="flex items-center gap-3 mb-4 md:hidden">
                                    <span className="material-symbols-outlined text-primary text-4xl">health_and_safety</span>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">Sonrisitapp</span>
                                </div>
                                
                                <h1 className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight text-left pb-1">
                                    Crea tu cuenta
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal pb-6">
                                    Únete a nuestra comunidad para gestionar tus turnos de forma fácil y rápida.
                                </p>
                                
                                {/* Error/Success Messages */}
                                {error && (
                                    <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                                        {success}
                                    </div>
                                )}
                                
                                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Nombre</p>
                                            <input 
                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
                                                placeholder="Ingresa tu nombre" 
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Apellido</p>
                                            <input 
                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
                                                placeholder="Ingresa tu apellido" 
                                                name="apellido"
                                                value={formData.apellido}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                    </div>
                                    
                                    <div>
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Correo Electrónico</p>
                                            <input 
                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
                                                placeholder="tu.correo@ejemplo.com" 
                                                type="email" 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                    </div>
                                    
                                    <div>
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Teléfono (opcional)</p>
                                            <input 
                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
                                                placeholder="+54 9 11 1234-5678" 
                                                type="tel" 
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </div>
                                    
                                    <div>
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Contraseña</p>
                                            <div className="relative flex w-full flex-1 items-center">
                                                <input 
                                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 pr-10 text-base font-normal leading-normal" 
                                                    placeholder="Crea una contraseña segura" 
                                                    type="password" 
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <div className="text-gray-500 dark:text-gray-400 absolute right-0 flex items-center justify-center pr-3">
                                                    <span className="material-symbols-outlined text-xl">visibility_off</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div>
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Confirmar Contraseña</p>
                                            <div className="relative flex w-full flex-1 items-center">
                                                <input 
                                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 pr-10 text-base font-normal leading-normal" 
                                                    placeholder="Vuelve a ingresar la contraseña" 
                                                    type="password" 
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <div className="text-gray-500 dark:text-gray-400 absolute right-0 flex items-center justify-center pr-3">
                                                    <span className="material-symbols-outlined text-xl">visibility_off</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center font-semibold text-base text-white h-12 px-6 rounded-lg bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 w-full mt-4 dark:ring-offset-background-dark disabled:opacity-50"
                                    >
                                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                                    </button>
                                </form>
                                
                                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                                    ¿Ya tienes una cuenta? <Link className="font-semibold text-primary hover:underline" to="/login">Inicia sesión</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;