import React from 'react';

const Button = ({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled = false, 
    onClick, 
    className = '',
    icon,
    fullWidth = false
}) => {
    const baseClasses = 'flex items-center justify-center font-bold leading-normal tracking-[0.015em] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer';
    
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
    };
    
    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base'
    };
    
    const widthClass = fullWidth ? 'w-full' : 'min-w-[84px]';
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} rounded-lg ${className}`}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            )}
            {icon && !loading && (
                <span className="material-symbols-outlined text-sm mr-2">{icon}</span>
            )}
            <span className="truncate">{children}</span>
        </button>
    );
};

export default Button;