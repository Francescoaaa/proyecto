// Autor: Francesco - https://github.com/Francescoaaa
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    🦷 SonrisitApp
                </Link>
                
                <div className="navbar-nav ms-auto">
                    {user ? (
                        <>
                            <span className="navbar-text me-3">
                                Hola, {user.nombre}
                            </span>
                            <Link className="nav-link" to="/reservar">Reservar</Link>
                            <Link className="nav-link" to="/mis-turnos">Mis Turnos</Link>
                            {user.rol === 'admin' && (
                                <Link className="nav-link" to="/admin">Admin</Link>
                            )}
                            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                            <Link className="nav-link" to="/registro">Registrarse</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;