import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="loading-spinner-container">
            <div className="spinner">
                <div className="spinner-circle"></div>
                <div className="spinner-pulse"></div>
            </div>
            <p className="loading-message">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
