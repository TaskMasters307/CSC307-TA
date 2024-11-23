// src/components/Welcome.jsx
import React from 'react'

/**
 * Welcome Component
 * Landing page that displays user welcome message and quick access to main features
 */
const Welcome = ({ setCurrentView, username = 'User' }) => {
    // Quick Navigation, not really necessary but looks cool i guess
    const quickNavButtons = [
        { view: 'tasks', label: 'Task List', icon: '📝' },
        { view: 'calendar', label: 'Calendar', icon: '📅' },
        { view: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    ]

    // Stats summary, currently hard coded but will need to link with database
    // IDEA: add a point multiplier for current streak?
    return (
        <div className="welcome">
            <h2>Welcome, {username}!</h2>
            <div className="stats-summary">
                <div className="stat-card">
                    <h3>Your Points</h3>
                    <p className="stat-value">150</p>
                </div>
                <div className="stat-card">
                    <h3>Tasks Completed</h3>
                    <p className="stat-value">12</p>
                </div>
                <div className="stat-card">
                    <h3>Current Streak</h3>
                    <p className="stat-value">5 days</p>
                </div>
                <div className="stat-card">
                    <h3>Point Multiplier</h3>
                    <p className="stat-value">1.5X</p>
                </div>
                <div className="stat-card">
                    <h3>Current Global Rank</h3>
                    <p className="stat-value">#5</p>
                </div>
            </div>
            <div className="quick-nav">
                <h3>Quick Navigation</h3>
                <div className="quick-nav-buttons">
                    {quickNavButtons.map((button) => (
                        <button
                            key={button.view}
                            onClick={() => setCurrentView(button.view)}
                            className="quick-nav-button"
                        >
                            <span className="icon">{button.icon}</span>
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Welcome
