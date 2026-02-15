import React, { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        // Add slide-in animation class on mount
        const timer = setTimeout(() => {
            // handled by context for removal
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    };

    return (
        <div className={`toast toast-${type}`}>
            <span className="toast-icon">{getIcon()}</span>
            <p className="toast-message">{message}</p>
            <button className="toast-close" onClick={onClose}>×</button>
        </div>
    );
};

export default Toast;
