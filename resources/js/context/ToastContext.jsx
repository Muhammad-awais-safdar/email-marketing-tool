import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    CheckCircle2,
    AlertCircle,
    Info,
    AlertTriangle,
} from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration !== Infinity) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const toast = {
        success: (msg, dur) => addToast(msg, "success", dur),
        error: (msg, dur) => addToast(msg, "error", dur),
        info: (msg, dur) => addToast(msg, "info", dur),
        warning: (msg, dur) => addToast(msg, "warning", dur),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <ToastItem
                            key={t.id}
                            toast={t}
                            onRemove={() => removeToast(t.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onRemove }) => {
    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        info: <Info className="w-5 h-5 text-indigo-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    };

    const colors = {
        success: "border-emerald-500/20 bg-emerald-950/20 text-emerald-200",
        error: "border-red-500/20 bg-red-950/20 text-red-200",
        info: "border-indigo-500/20 bg-indigo-950/20 text-indigo-200",
        warning: "border-amber-500/20 bg-amber-950/20 text-amber-200",
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${colors[toast.type]} min-w-[280px] max-w-md`}
        >
            <div className="flex-shrink-0">{icons[toast.type]}</div>
            <p className="text-sm font-medium flex-grow">{toast.message}</p>
            <button
                onClick={onRemove}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
                <X className="w-4 h-4 opacity-50" />
            </button>
        </motion.div>
    );
};
