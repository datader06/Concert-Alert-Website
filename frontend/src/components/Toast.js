import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">{getIcon()}</div>
            <p className="toast-message">{message}</p>
            <button className="toast-close" onClick={onClose}>
                ×
            </button>
        </div>
    );
};

export default Toast;
