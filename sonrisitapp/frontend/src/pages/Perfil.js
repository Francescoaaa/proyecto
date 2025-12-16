// Autor: Francesco - https://github.com/Francescoaaa
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Button from '../components/Button';
import Alert from '../components/Alert';

const Perfil = ({ user, setUser }) => {
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [promoNotifications, setPromoNotifications] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleExportData = () => {
        // Validar que el usuario esté autenticado
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            return;
        }

        const userData = {
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            fechaRegistro: user.created_at || new Date().toISOString(),
            configuraciones: {
                notificacionesEmail: emailNotifications,
                notificacionesPromo: promoNotifications
            }
        };
        
        // Sanitizar nombre de archivo
        const sanitizedName = user.nombre.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sonrisitapp-datos-${sanitizedName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setSuccess('Datos exportados exitosamente');
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
                return;
            }

            const confirmEmail = prompt('Para confirmar, escribe tu email:');
            if (confirmEmail !== user.email) {
                setError('Email de confirmación incorrecto');
                return;
            }

            await api.eliminarCuenta(user.id, confirmEmail);
            
            // Limpiar sesión y redirigir
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            
            alert('Cuenta eliminada exitosamente');
            window.location.href = '/login';
        } catch (error) {
            setError('Error al eliminar la cuenta: ' + error.message);
            setShowDeleteModal(false);
        }
    };

    const saveNotificationSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
                return;
            }

            await api.actualizarPreferenciasNotificaciones(user.id, {
                email_notifications: emailNotifications,
                promo_notifications: promoNotifications
            });
            
            setSuccess('Preferencias de notificaciones guardadas');
        } catch (error) {
            setError('Error al guardar las preferencias');
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                email: user.email || '',
                telefono: user.telefono || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            // Cargar preferencias de notificaciones desde el usuario
            setEmailNotifications(user.email_notifications !== false);
            setPromoNotifications(user.promo_notifications === true);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        const errors = { ...fieldErrors };
        if (name === 'email') {
            if (!value) {
                errors.email = 'El email es obligatorio';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                errors.email = 'El email no es válido';
            } else {
                delete errors.email;
            }
        }
        if (name === 'newPassword' && value) {
            if (value.length < 6) {
                errors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
            } else {
                delete errors.newPassword;
            }
        }
        if (name === 'confirmPassword' && value) {
            if (value !== formData.newPassword) {
                errors.confirmPassword = 'Las contraseñas no coinciden';
            } else {
                delete errors.confirmPassword;
            }
        }
        setFieldErrors(errors);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.newPassword) {
            if (!formData.currentPassword) {
                setError('Debes ingresar tu contraseña actual para cambiarla');
                setLoading(false);
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setError('Las contraseñas nuevas no coinciden');
                setLoading(false);
                return;
            }
        }

        try {
            const updateData = {
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const response = await api.actualizarUsuario(user.id, updateData);
            
            if (response.message) {
                setSuccess('Perfil actualizado exitosamente');
                const updatedUser = {
                    ...user,
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono
                };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                setFormData({
                    ...formData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordFields(false);
            } else {
                setError(response.error || 'Error al actualizar perfil');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout 
            user={user} 
            setUser={setUser} 
            title="Mi Perfil"
        >
            <Alert type="error" message={error} />
            <Alert type="success" message={success} />
                    
            <div className="flex flex-col gap-8">
                {/* Profile Header Card */}
                <Card>
                    <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 rounded-full h-24 w-24 flex items-center justify-center text-primary text-3xl font-bold">
                                {user?.nombre?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-slate-900 dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em]">{user?.nombre}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </Card>
                        
                {/* Personal Information Card */}
                <Card title="Información Personal">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                            
                            <FormField
                                label="Número de Teléfono"
                                name="telefono"
                                type="tel"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                            
                            <FormField
                                label="Correo Electrónico"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={fieldErrors.email}
                                className="md:col-span-2"
                                required
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <Button 
                                variant="secondary"
                                onClick={() => {
                                    setFormData({
                                        nombre: user?.nombre || '',
                                        email: user?.email || '',
                                        telefono: user?.telefono || '',
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                    setError('');
                                    setSuccess('');
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit"
                                loading={loading}
                            >
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </Card>
                        
                        {/* Data Management Card */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-slate-200 dark:border-slate-800">Gestión de Datos</h2>
                            <div className="flex flex-col gap-4 pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-800 dark:text-slate-200 font-medium">Exportar mis datos</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Descarga una copia de tu información personal.</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleExportData}
                                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                    >
                                        <span className="material-symbols-outlined text-sm mr-1">download</span>
                                        <span className="truncate">Exportar</span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-800 dark:text-slate-200 font-medium">Eliminar cuenta</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Elimina permanentemente tu cuenta y todos tus datos.</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-200 dark:hover:bg-red-900/50"
                                    >
                                        <span className="material-symbols-outlined text-sm mr-1">delete</span>
                                        <span className="truncate">Eliminar</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security and Preferences Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Security Card */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-slate-200 dark:border-slate-800">Seguridad</h2>
                                <div className="flex items-center justify-between pt-6">
                                    <div>
                                        <p className="text-slate-800 dark:text-slate-200 font-medium">Contraseña</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Actualizada recientemente</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setShowPasswordFields(!showPasswordFields)}
                                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
                                    >
                                        <span className="truncate">{showPasswordFields ? 'Cancelar' : 'Cambiar Contraseña'}</span>
                                    </button>
                                </div>
                                
                                {showPasswordFields && (
                                    <div className="mt-6 space-y-4">
                                        <input 
                                            className="form-input w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark h-10 px-3 text-sm"
                                            name="currentPassword"
                                            placeholder="Contraseña actual" 
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                        />
                                        <input 
                                            className="form-input w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark h-10 px-3 text-sm"
                                            name="newPassword"
                                            placeholder="Nueva contraseña" 
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                        <input 
                                            className="form-input w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark h-10 px-3 text-sm"
                                            name="confirmPassword"
                                            placeholder="Confirmar contraseña" 
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {/* Preferences Card */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-slate-200 dark:border-slate-800">Preferencias de Notificaciones</h2>
                                <div className="flex flex-col gap-4 pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-800 dark:text-slate-200 font-medium">Recordatorios de citas por correo</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Recibirás un email 24hs antes de tu cita.</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setEmailNotifications(!emailNotifications)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                                emailNotifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                                            }`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                emailNotifications ? 'translate-x-5' : 'translate-x-0'
                                            }`}></span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-800 dark:text-slate-200 font-medium">Notificaciones de promociones</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Ofertas y novedades sobre nuestros servicios.</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setPromoNotifications(!promoNotifications)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                                promoNotifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                                            }`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                promoNotifications ? 'translate-x-5' : 'translate-x-0'
                                            }`}></span>
                                        </button>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <button 
                                            type="button"
                                            onClick={saveNotificationSettings}
                                            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
                                        >
                                            <span className="material-symbols-outlined text-sm mr-1">save</span>
                                            <span className="truncate">Guardar Preferencias</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    {/* Delete Account Modal */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full mx-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">¿Eliminar cuenta?</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    Esta acción es irreversible. Se eliminarán todos tus datos, turnos e información personal.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button 
                                        onClick={() => setShowDeleteModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={confirmDeleteAccount}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                    >
                                        Eliminar Cuenta
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </PageLayout>
    );
};

export default Perfil;