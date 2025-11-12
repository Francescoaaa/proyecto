import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RecuperarPassword from './pages/RecuperarPassword';
import Reservar from './pages/Reservar';
import MisTurnos from './pages/MisTurnos';
import Admin from './pages/Admin';
import Perfil from './pages/Perfil';
import Toast from './components/Toast';
import LoadingScreen from './components/LoadingScreen';
import ServerStatus from './components/ServerStatus';
import AuthDebug from './components/AuthDebug';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import { useToast } from './hooks/useToast';

function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Iniciando aplicación...');
    const [globalLoading, setGlobalLoading] = useState(false);
    const [globalLoadingMessage, setGlobalLoadingMessage] = useState('');
    const { toasts, showToast, removeToast } = useToast();

    // Exponer función de loading global
    useEffect(() => {
        window.setGlobalLoading = (loading, message = 'Cargando...') => {
            setGlobalLoading(loading);
            setGlobalLoadingMessage(message);
        };
        
        return () => {
            delete window.setGlobalLoading;
        };
    }, []);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                setLoadingMessage('Verificando sesión...');
                
                // Simular tiempo de carga mínimo para mostrar la pantalla
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');
                
                if (token && userData) {
                    setLoadingMessage('Cargando perfil de usuario...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    setUser(JSON.parse(userData));
                }
                
                setLoadingMessage('Finalizando...');
                await new Promise(resolve => setTimeout(resolve, 300));
                
            } catch (error) {
                console.error('Error al inicializar la aplicación:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeApp();
    }, []);

    const ProtectedRoute = ({ children }) => {
        console.log('PROTECTED_ROUTE: Verificando usuario:', user);
        console.log('PROTECTED_ROUTE: Token en localStorage:', localStorage.getItem('token') ? 'Existe' : 'No existe');
        console.log('PROTECTED_ROUTE: User en localStorage:', localStorage.getItem('user') ? 'Existe' : 'No existe');
        
        if (!user) {
            console.log('PROTECTED_ROUTE: Usuario no encontrado, redirigiendo a login');
            return <Navigate to="/login" />;
        }
        
        console.log('PROTECTED_ROUTE: Usuario autenticado, mostrando contenido');
        return children;
    };

    if (isLoading) {
        return <LoadingScreen message={loadingMessage} />;
    }

    return (
        <ErrorBoundary>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="App font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
                    {/* Loading global para requests */}
                    {globalLoading && <LoadingScreen message={globalLoadingMessage} />}
                    <Routes>
                    <Route 
                        path="/" 
                        element={
                            user ? <Navigate to="/reservar" /> : <Landing />
                        } 
                    />
                    
                    <Route 
                        path="/login" 
                        element={
                            user ? <Navigate to="/reservar" /> : <Login setUser={setUser} />
                        } 
                    />
                    
                    <Route 
                        path="/registro" 
                        element={
                            user ? <Navigate to="/reservar" /> : <Registro />
                        } 
                    />
                    
                    <Route 
                        path="/recuperar-password" 
                        element={
                            user ? <Navigate to="/reservar" /> : <RecuperarPassword />
                        } 
                    />
                    
                    <Route 
                        path="/reservar" 
                        element={
                            <ProtectedRoute>
                                <Reservar user={user} setUser={setUser} />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/mis-turnos" 
                        element={
                            <ProtectedRoute>
                                <MisTurnos user={user} setUser={setUser} />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute>
                                <Admin user={user} setUser={setUser} />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/perfil" 
                        element={
                            <ProtectedRoute>
                                <Perfil user={user} setUser={setUser} />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Página 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Server Status Monitor */}
                <ServerStatus />
                
                {/* Auth Debug (temporal) */}
                <AuthDebug user={user} />
                
                {/* Toast Notifications */}
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;