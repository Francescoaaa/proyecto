import React from 'react';

const Card = ({ 
    children, 
    title, 
    subtitle, 
    className = '', 
    padding = 'p-6',
    showBorder = true 
}) => {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm ${showBorder ? 'border border-slate-200 dark:border-slate-800' : ''} ${padding} ${className}`}>
            {(title || subtitle) && (
                <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                    {title && (
                        <h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold leading-tight tracking-[-0.015em]">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;