import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navigation.css';

const Navigation = () => {
    const navItems = [
        { path: '/welcome', label: ' Home', icon: '🏠' },
        { path: '/tasks', label: ' Tasks', icon: '📝' },
        { path: '/calendar', label: ' Calendar', icon: '📅' },
        { path: '/leaderboard', label: ' Leaderboard', icon: '🏆' },
        { path: '/team', label: ' Team', icon: '👥' },
        { path: '/settings', label: ' Settings', icon: '⚙️' },
    ];

    return (
        <nav className="navigation">
            {navItems.map(item => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                        `nav-button ${isActive ? 'active' : ''}`
                    }
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;