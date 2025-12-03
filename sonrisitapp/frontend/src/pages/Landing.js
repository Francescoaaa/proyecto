import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AnimatedCounter = ({ target, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();

    // Asegurar que target sea un número válido
    const validTarget = typeof target === 'number' && !isNaN(target) ? target : 0;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible || validTarget === 0) {
            if (validTarget === 0) setCount(0);
            return;
        }

        let startTime;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            const newCount = Math.floor(progress * validTarget);
            setCount(newCount);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }, [isVisible, validTarget, duration]);

    return (
        <div ref={ref} className="text-4xl font-bold mb-2">
            {count}{suffix}
        </div>
    );
};

const StatsSection = () => {
    const [stats, setStats] = useState({
        usuariosRegistrados: 0,
        turnosReservados: 0,
        turnosHoy: 0,
        odontologosActivos: 0,
        serviciosDisponibles: 0,
        turnosCompletados: 0
    });

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                const data = await api.obtenerEstadisticas();
                // Validar que los datos sean números válidos
                const validatedStats = {
                    usuariosRegistrados: Number(data?.usuariosRegistrados) || 0,
                    turnosReservados: Number(data?.turnosReservados) || 0,
                    turnosHoy: Number(data?.turnosHoy) || 0,
                    odontologosActivos: Number(data?.odontologosActivos) || 0,
                    serviciosDisponibles: Number(data?.serviciosDisponibles) || 0,
                    turnosCompletados: Number(data?.turnosCompletados) || 0
                };
                setStats(validatedStats);
                console.log('Landing: Estadísticas cargadas desde BD:', validatedStats);
            } catch (error) {
                console.error('Landing: Error al cargar estadísticas:', error);
                // Mantener valores en 0 si no hay conexión
                setStats({
                    usuariosRegistrados: 0,
                    turnosReservados: 0,
                    turnosHoy: 0,
                    odontologosActivos: 0,
                    serviciosDisponibles: 0,
                    turnosCompletados: 0
                });
            }
        };
        cargarEstadisticas();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-primary">
                    <AnimatedCounter target={stats.usuariosRegistrados} suffix="+" />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Pacientes Registrados</div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Personas que confían en nosotros</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-accent">
                    <AnimatedCounter target={stats.turnosCompletados} suffix="+" />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Tratamientos Realizados</div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Sonrisas que hemos cuidado</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-green-600">
                    <AnimatedCounter target={stats.odontologosActivos} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Odontólogos Activos</div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Profesionales a tu servicio</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-blue-600">
                    <AnimatedCounter target={stats.serviciosDisponibles} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Servicios Disponibles</div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Tratamientos que ofrecemos</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-purple-600">
                    <AnimatedCounter target={stats.turnosReservados} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Turnos Activos</div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Citas programadas</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-red-600">
                    <AnimatedCounter target={stats.turnosHoy} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Turnos Hoy</div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Atenciones de hoy</div>
            </div>
        </div>
    );
};

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            className={`fixed bottom-8 right-8 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}
            onClick={scrollToTop}
            aria-label="Volver arriba"
        >
            <span className="material-symbols-outlined">keyboard_arrow_up</span>
        </button>
    );
};

const FadeInSection = ({ children, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${className}`}
        >
            {children}
        </div>
    );
};

const Landing = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const smoothScroll = (targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col">
            {/* TopNavBar */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800' 
                    : 'bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800'
            }`}>
                <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="text-primary">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold">Sonrisitapp</h2>
                    </div>
                    <nav className="hidden md:flex flex-1 justify-center gap-8">
                        <button 
                            onClick={() => smoothScroll('inicio')}
                            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                        >
                            Inicio
                        </button>
                        <button 
                            onClick={() => smoothScroll('como-funciona')}
                            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                        >
                            Cómo Funciona
                        </button>
                        <button 
                            onClick={() => smoothScroll('beneficios')}
                            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                        >
                            Beneficios
                        </button>
                    </nav>
                    <div className="flex items-center gap-2">
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">
                                {mobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                        <div className="hidden md:flex gap-2">
                            <Link 
                                to="/login"
                                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray-200 dark:bg-white/10 text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300 hover:scale-105"
                            >
                                <span className="truncate">Iniciar Sesión</span>
                            </Link>
                            <Link 
                                to="/registro"
                                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-accent text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <span className="truncate">Reservar Turno</span>
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${
                    mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="px-6 py-4 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                        <nav className="flex flex-col gap-4">
                            <button 
                                onClick={() => smoothScroll('inicio')}
                                className="text-left text-sm font-medium hover:text-primary transition-colors"
                            >
                                Inicio
                            </button>
                            <button 
                                onClick={() => smoothScroll('como-funciona')}
                                className="text-left text-sm font-medium hover:text-primary transition-colors"
                            >
                                Cómo Funciona
                            </button>
                            <button 
                                onClick={() => smoothScroll('beneficios')}
                                className="text-left text-sm font-medium hover:text-primary transition-colors"
                            >
                                Beneficios
                            </button>
                        </nav>
                        <div className="flex flex-col gap-2 mt-4">
                            <Link 
                                to="/login"
                                className="flex cursor-pointer items-center justify-center rounded-full h-10 px-4 bg-gray-200 dark:bg-white/10 text-text-light dark:text-text-dark text-sm font-bold transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                            <Link 
                                to="/registro"
                                className="flex cursor-pointer items-center justify-center rounded-full h-10 px-4 bg-accent text-white text-sm font-bold transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Reservar Turno
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* HeroSection */}
                <section id="inicio" className="py-16 sm:py-24 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <FadeInSection className="flex flex-col gap-6 text-center lg:text-left">
                                <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter animate-pulse">
                                    Tu sonrisa, nuestra prioridad. Agenda tu cita dental fácilmente.
                                </h1>
                                <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400">
                                    El sistema de gestión de turnos para el servicio odontológico comunitario que cuida de ti.
                                </p>
                                <div className="flex justify-center lg:justify-start">
                                    <Link 
                                        to="/registro"
                                        className="group flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-accent text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        <span className="truncate group-hover:animate-bounce">Reservar un Turno Ahora</span>
                                        <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </FadeInSection>
                            <FadeInSection className="w-full">
                                <div className="w-full bg-center bg-no-repeat aspect-square sm:aspect-video lg:aspect-square bg-cover rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform" style={{
                                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmguFangP-T8ZxogEzHXxGmobsMRPSkRyM5MP0vM_gFlJlC7QWWVpad5cihvDG_vceyOxmloKEGSy1cjhKz9rJIMaKx8-6G-CJzw9qsQB58yngdJECmdxEtY5i33XN3765e8OW2W2zrxc9h5apYFnmueoQJlajlqnEEfzoIJ2B0NTz45z_CH41PTOQwyTdx93wTL3jKwqjt0c732MLk4KEa7b1GEgeG0rpCaZ24sENp2H7MtfhMzdRf69kBSjEduS3H2oXbuL02XM')"
                                }}></div>
                            </FadeInSection>
                        </div>
                    </div>
                </section>

                {/* "How It Works" Section */}
                <section id="como-funciona" className="py-16 sm:py-24 bg-white dark:bg-background-dark">
                    <div className="container mx-auto px-6">
                        <FadeInSection className="text-center mb-12">
                            <h2 className="text-3xl font-bold leading-tight tracking-tight">¿Cómo funciona?</h2>
                        </FadeInSection>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FadeInSection>
                                <Link to="/login" className="flex flex-col items-center text-center gap-4 rounded-lg bg-background-light dark:bg-gray-800/50 p-6 hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                        <span className="material-symbols-outlined text-4xl">person_add</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Regístrate</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Crea tu cuenta en segundos para acceder a todos nuestros servicios.</p>
                                    </div>
                                </Link>
                            </FadeInSection>
                            <FadeInSection>
                                <Link to="/login" className="flex flex-col items-center text-center gap-4 rounded-lg bg-background-light dark:bg-gray-800/50 p-6 hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                        <span className="material-symbols-outlined text-4xl">calendar_month</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Elige tu Horario</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Selecciona el tratamiento que necesitas y elige la fecha y hora que más te convenga.</p>
                                    </div>
                                </Link>
                            </FadeInSection>
                            <FadeInSection>
                                <Link to="/login" className="flex flex-col items-center text-center gap-4 rounded-lg bg-background-light dark:bg-gray-800/50 p-6 hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                        <span className="material-symbols-outlined text-4xl">event_available</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Asiste a tu Cita</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Recibirás un recordatorio. Asiste a tu turno y cuida tu salud dental.</p>
                                    </div>
                                </Link>
                            </FadeInSection>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="py-16 sm:py-24 bg-primary/5 dark:bg-primary/10">
                    <div className="container mx-auto px-6">
                        <FadeInSection className="text-center mb-12">
                            <h2 className="text-3xl font-bold leading-tight tracking-tight">Nuestra Comunidad en Números</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-4">Únete a las personas que ya confían en nosotros</p>
                        </FadeInSection>
                        <StatsSection />
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="beneficios" className="py-16 sm:py-24">
                    <div className="container mx-auto px-6">
                        <FadeInSection className="text-center mb-12">
                            <h2 className="text-3xl font-bold leading-tight tracking-tight">Beneficios de Cuidar tu Sonrisa con Nosotros</h2>
                        </FadeInSection>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FadeInSection className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group hover:border-primary/50">
                                <div className="text-primary group-hover:scale-110 transition-transform duration-300"><span className="material-symbols-outlined text-3xl">health_and_safety</span></div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Atención Profesional</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Contamos con un equipo de odontólogos calificados y comprometidos con tu bienestar.</p>
                                </div>
                            </FadeInSection>
                            <FadeInSection className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group hover:border-primary/50">
                                <div className="text-primary group-hover:scale-110 transition-transform duration-300"><span className="material-symbols-outlined text-3xl">schedule</span></div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Fácil y Rápido</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Agenda tu cita en línea en menos de un minuto, sin llamadas ni esperas.</p>
                                </div>
                            </FadeInSection>
                            <FadeInSection className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group hover:border-primary/50">
                                <div className="text-primary group-hover:scale-110 transition-transform duration-300"><span className="material-symbols-outlined text-3xl">groups</span></div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Servicio Comunitario</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Forma parte de una iniciativa que busca mejorar la salud dental de nuestra comunidad.</p>
                                </div>
                            </FadeInSection>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-6">
                        <FadeInSection className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-10 md:p-16 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                            <h2 className="text-3xl font-bold mb-4 animate-pulse">¿Listo para empezar a cuidar tu salud dental?</h2>
                            <p className="mb-8 text-lg text-white/80">Regístrate gratis y agenda tu primera cita hoy mismo.</p>
                            <Link 
                                to="/registro"
                                className="group inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-accent text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                            >
                                <span className="truncate group-hover:animate-bounce">Únete a Nuestra Comunidad y Sonríe</span>
                                <span className="material-symbols-outlined ml-2 group-hover:rotate-12 transition-transform">sentiment_very_satisfied</span>
                            </Link>
                        </FadeInSection>
                    </div>
                </section>
            </main>

            <ScrollToTopButton />

            {/* Footer */}
            <footer className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-semibold">Sonrisitapp</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cuidando sonrisas en nuestra comunidad.</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">info@sonrisitapp.com</p>
                        </div>
                        <div className="flex gap-4">
                            <a className="text-gray-500 hover:text-primary transition-colors" href="#">Facebook</a>
                            <a className="text-gray-500 hover:text-primary transition-colors" href="#">Instagram</a>
                            <a className="text-gray-500 hover:text-primary transition-colors" href="#">Twitter</a>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 Sonrisitapp. Todos los derechos reservados.</p>
                        <div className="flex gap-4 text-sm">
                            <a className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors" href="#">Términos de Servicio</a>
                            <a className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors" href="#">Política de Privacidad</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;