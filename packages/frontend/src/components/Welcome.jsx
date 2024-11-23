// src/components/Welcome.jsx
import React, { useEffect } from 'react'
import { FetchUserStats } from './httpUltilities'

/**
 * Welcome Component
 * Landing page that displays user welcome message and quick access to main features
 */
const Welcome = ({ setCurrentView, username, stats, onStatsUpdate }) => {
    useEffect(() => {}, [username])
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
                    <p className="stat-value">{stats.totalPoints}</p>
                </div>
                <div className="stat-card">
                    <h3>Tasks Completed</h3>
                    <p className="stat-value">{stats.tasksCompleted}</p>
                </div>
                <div className="stat-card">
                    <h3>Current Streak</h3>
                    <p className="stat-value">{stats.currentStreak}</p>
                </div>
                <div className="stat-card">
                    <h3>Point Multiplier</h3>
                    <p className="stat-value">{stats.pointsMultiplier}</p>
                </div>
                <div className="stat-card">
                    <h3>Current Global Rank</h3>
                    <p className="stat-value">#{stats.globalRank || '-'}</p>
                </div>
            </div>
            <div className="quick-nav">
                <h3>Quick Navigation</h3>
                <div className="quick-nav-buttons">
                    {quickNavButtons.map((button) => (
                        <button
                            key={button.view}
                            onClick={() => navigate(`/${button.view}`)}
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
