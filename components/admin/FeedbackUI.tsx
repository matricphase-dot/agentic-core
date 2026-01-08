"use client";

import React, { useState, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './FeedbackUI.module.css';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    title: string;
    message?: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, title, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map(toast => (
                    <div key={toast.id} className={`${styles.toast} ${styles[`toast${toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}`]}`}>
                        <div className={styles.toastIcon}>
                            {toast.type === 'success' && <CheckCircle className="text-emerald-500" size={20} />}
                            {toast.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
                            {toast.type === 'info' && <Info className="text-blue-500" size={20} />}
                        </div>
                        <div className={styles.toastContent}>
                            <div className={styles.toastTitle}>{toast.title}</div>
                            {toast.message && <div className={styles.toastMessage}>{toast.message}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
}

export function Skeleton({ width, height, className }: { width?: string | number, height?: string | number, className?: string }) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{ width: width || '100%', height: height || '1rem' }}
        />
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton width="20%" height="1.25rem" />
                    <Skeleton width="50%" height="1.25rem" />
                    <Skeleton width="15%" height="1.25rem" />
                    <Skeleton width="15%" height="1.25rem" />
                </div>
            ))}
        </div>
    );
}
