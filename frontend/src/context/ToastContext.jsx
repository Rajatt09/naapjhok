import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-24 right-4 md:right-8 z-50 flex flex-col gap-3 font-sans pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, onClose }) => {
    const variants = {
        initial: { opacity: 0, x: 50, scale: 0.9 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }
    };

    const styles = {
        success: {
            bg: 'bg-brand-coffee',
            border: 'border-brand-rust',
            text: 'text-brand-cream',
            icon: <CheckCircle className="text-brand-rust" size={20} />
        },
        error: {
            bg: 'bg-red-900',
            border: 'border-red-700',
            text: 'text-white',
            icon: <AlertCircle className="text-red-400" size={20} />
        },
        info: {
            bg: 'bg-brand-brown',
            border: 'border-brand-tan',
            text: 'text-white',
            icon: <Info className="text-brand-beige" size={20} />
        }
    };

    const style = styles[type] || styles.info;

    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-xl shadow-2xl border ${style.bg} ${style.border} flex items-start gap-4 backdrop-blur-md`}
        >
            <div className="mt-0.5 shrink-0">{style.icon}</div>
            <div className="flex-1">
                <p className={`text-sm font-medium ${style.text} leading-snug`}>{message}</p>
            </div>
            <button 
                onClick={onClose} 
                className={`shrink-0 opacity-60 hover:opacity-100 transition-opacity ${style.text}`}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
