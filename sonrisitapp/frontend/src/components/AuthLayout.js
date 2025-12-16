// Autor: Francesco - https://github.com/Francescoaaa
import React from 'react';

const AuthLayout = ({ 
    children, 
    title, 
    subtitle, 
    imageUrl, 
    showImage = true,
    imagePosition = 'right' // 'left' or 'right'
}) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
                    <div className="w-full max-w-5xl overflow-hidden rounded-xl bg-white dark:bg-gray-900/50 shadow-lg flex flex-col md:flex-row">
                        {/* Form Side */}
                        <div className={`w-full ${showImage ? 'md:w-1/2' : ''} p-8 sm:p-12 flex flex-col justify-center ${imagePosition === 'right' ? 'order-1' : 'order-2'}`}>
                            <div className="max-w-md mx-auto w-full">
                                {/* Logo and Title */}
                                <div className="text-center md:text-left mb-10">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                        <span className="material-symbols-outlined text-primary text-4xl">
                                            clinical_notes
                                        </span>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sonrisitapp</h1>
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
                                </div>
                                
                                {children}
                            </div>
                        </div>
                        
                        {/* Image Side */}
                        {showImage && (
                            <div className={`hidden md:block md:w-1/2 ${imagePosition === 'right' ? 'order-2' : 'order-1'}`}>
                                <div 
                                    className="h-full w-full bg-cover bg-center" 
                                    style={{ backgroundImage: `url('${imageUrl}')` }}
                                />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AuthLayout;