import React from 'react';
import '../styles/SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div className="skeleton-card">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-text"></div>
                        </div>
                    </div>
                );

            case 'artist-card':
                return (
                    <div className="skeleton-artist-card">
                        <div className="skeleton-circle"></div>
                        <div className="skeleton-title"></div>
                        <div className="skeleton-text"></div>
                    </div>
                );

            case 'album-card':
                return (
                    <div className="skeleton-album-card">
                        <div className="skeleton-square"></div>
                        <div className="skeleton-title"></div>
                        <div className="skeleton-text"></div>
                    </div>
                );

            case 'concert-card':
                return (
                    <div className="skeleton-concert-card">
                        <div className="skeleton-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-text"></div>
                            <div className="skeleton-text short"></div>
                        </div>
                    </div>
                );

            case 'detail-header':
                return (
                    <div className="skeleton-detail-header">
                        <div className="skeleton-large-image"></div>
                        <div className="skeleton-detail-content">
                            <div className="skeleton-title large"></div>
                            <div className="skeleton-text"></div>
                            <div className="skeleton-text"></div>
                        </div>
                    </div>
                );

            default:
                return <div className="skeleton-line"></div>;
        }
    };

    return (
        <div className="skeleton-container">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="skeleton-item">
                    {renderSkeleton()}
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
