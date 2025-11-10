import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import Button from '../components/Button';
import Alert from '../components/Alert';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Validación en tiempo real
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
        if (name === 'password') {
            if (!value) {
                errors.password = 'La contraseña es obligatoria';
            } else if (value.length < 6) {
                errors.password = 'La contraseña debe tener al menos 6 caracteres';
            } else {
                delete errors.password;
            }
        }
        setFieldErrors(errors);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.login(formData);
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                setUser(response.user);
                navigate('/reservar');
            } else {
                setError(response.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            subtitle="Gestionando sonrisas en tu comunidad."
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAgqDe-6ZdtO6AaGHndMKlHlcSNp6qd0QVcA5GKM4PNyC2gvRRmNQX7NS74Co4G0HdUrOminXt7M-72J82YRRZT6ItvF1OrGBGZShr1GZZzY4-TPfo8n65e0POKlR8C39vvuIFPQFqErG5tiQzyCiQpIsJh9fMYKkyL2NxQhnhb44pg5uDEevRKV_e2EuC9zrSxxppweyY1IDP0ghXvvL7jZUBDYfujZoFfTsp782dUFHqMsvkVoG7O2APH2RWfIWrxDySx4amXMYc"
        >
            <Alert type="error" message={error} />
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <FormField
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    placeholder="tu.correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                    icon="mail"
                    required
                />
                
                <FormField
                    label="Contraseña"
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    error={fieldErrors.password}
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    required
                />
                
                <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                    size="lg"
                >
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </Button>
            </form>
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-sm">
                <Link className="font-medium text-primary hover:text-primary/80" to="/recuperar-password">
                    Olvidé mi contraseña
                </Link>
                <Link className="font-medium text-primary hover:text-primary/80" to="/registro">
                    ¿No tienes una cuenta? Regístrate
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;