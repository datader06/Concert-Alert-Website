import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Breadcrumbs.css';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    // Map route segments to readable names
    const routeNameMap = {
        'artist': 'Artists',
        'concerts': 'Concerts',
        'albums': 'Albums',
        'discover': 'Discover',
        'favorites': 'Favorites',
        'notifications': 'Notifications',
        'profile': 'Profile'
    };

    // Don't show breadcrumbs on home page
    if (pathnames.length === 0) return null;

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
                <li className="breadcrumb-item">
                    <Link to="/">🏠 Home</Link>
                </li>
                {pathnames.map((segment, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const displayName = routeNameMap[segment] || segment;

                    return (
                        <li key={routeTo} className="breadcrumb-item">
                            <span className="breadcrumb-separator">›</span>
                            {isLast ? (
                                <span className="breadcrumb-current">{displayName}</span>
                            ) : (
                                <Link to={routeTo}>{displayName}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
