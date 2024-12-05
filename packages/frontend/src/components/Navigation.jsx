import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../css/Navigation.css'

/**
 * Navigation Component
 * Handles navigation between different views using React Router
 */
const Navigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/welcome', view: 'welcome', label: ' Home', icon: '🏠' },
        { path: '/tasks', view: 'tasks', label: ' Tasks', icon: '📝' },
        { path: '/calendar', view: 'calendar', label: ' Calendar', icon: '📅' },
        { path: '/leaderboard', view: 'leaderboard', label: ' Leaderboard', icon: '🏆' },
        { path: '/settings', view: 'settings', label: ' Settings', icon: '⚙️' },
    ];

    return (
        <nav className="navigation">
            {navItems.map(item => (
                <Link
                    key={item.view}
                    to={item.path}
                    className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;