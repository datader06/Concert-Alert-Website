import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon = '📭', title, message, actionButton }) => {
    return (
        <div className="empty-state-container">
            <div className="empty-icon">{icon}</div>
            <h2 className="empty-title">{title}</h2>
            <p className="empty-message">{message}</p>
            {actionButton && (
                <div className="empty-action">
                    {actionButton}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
