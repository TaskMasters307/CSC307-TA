// src/components/Navigation.jsx
import React from 'react'
import '../css/Navigation.css'
/**
 * Navigation Component
 * Handles switching between different views
 */
const Navigation = ({ currentView, setCurrentView }) => {
    const navItems = [
        { view: 'welcome', label: ' Home', icon: '🏠' },
        { view: 'tasks', label: ' Tasks', icon: '📝' },
        { view: 'calendar', label: ' Calendar', icon: '📅' },
        { view: 'leaderboard', label: ' Leaderboard', icon: '🏆' },
        { view: 'team', label: ' Team', icon: '👥' },
        { view: 'settings', label: ' Settings', icon: '⚙️' },
    ];
    return (
        <nav className="navigation">
            {navItems.map(item => (
                <button
                    key={item.view}
                    className={`nav-button ${currentView === item.view ? 'active' : ''}`}
                    onClick={() => setCurrentView(item.view)}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default Navigation;
