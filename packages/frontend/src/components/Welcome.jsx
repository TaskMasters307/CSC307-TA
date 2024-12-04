// src/components/Welcome.jsx
import React, { useEffect, useState } from 'react';
import '../css/Welcome.css';
/**
 * Welcome Component
 * Landing page that displays user welcome message and quick access to main features
 */
const Welcome = ({ setCurrentView, username = 'User' }) => {
    const [statistics, setStatistics] = useState({
        tasksCompleted: 0,
        currentStreak: 0,
        totalPoints: 0,
      });
    
      useEffect(() => {
        // Fetch user statistics from the backend
        const fetchStatistics = async () => {
          try {
            const response = await fetch(`/users/${username}/statistics`);
            const data = await response.json();
            setStatistics(data);
          } catch (error) {
            console.error('Error fetching user statistics:', error);
          }
        };
    
        fetchStatistics();
      }, [username]);
    
    return (
        <div className="welcome">
            <h2>Welcome, {username}!</h2>
            <div className="stats-summary">
                <div className="stat-card">
                    <h3>Your Points</h3>
                    <p className="stat-value">{statistics.totalPoints}</p>
                </div>
                <div className="stat-card">
                    <h3>Tasks Completed</h3>
                    <p className="stat-value">{statistics.tasksCompleted}</p>
                </div>
                <div className="stat-card">
                    <h3>Current Streak</h3>
                    <p className="stat-value">{statistics.currentStreak}</p>
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
        </div>
    )
}

export default Welcome
