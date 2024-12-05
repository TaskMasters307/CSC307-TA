// src/components/Welcome.jsx
import React, { useState, useEffect } from 'react'
import '../css/Welcome.css'
/**
 * Welcome Component
 * Landing page that displays user welcome message and quick access to main features
 */
const API_URL = process.env.NODE_ENV === 'production' 
    ? "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
    : "";

const Welcome = ({ userId }) => {
    const [stats, setStats] = useState({
        username: '',
        totalPoints: 0,
        tasksCompleted: 0,
        currentStreak: 0,
        multiplier: 1.0,
        rank: '-'
    });

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`${API_URL}/api/users/${userId}/stats`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user stats');
                }
                const data = await response.json();
                console.log('Received user stats:', data);

                // Calculate multiplier based on streak
                const multiplier = 1 + (Math.min(data.currentStreak, 7) * 0.1);
                
                setStats({
                    username: data.username,
                    totalPoints: Math.round(data.totalPoints),
                    tasksCompleted: data.tasksCompleted,
                    currentStreak: data.currentStreak,
                    multiplier: multiplier.toFixed(1),
                    rank: data.rank || '-'
                });
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        fetchUserStats();
    }, [userId]);

    const getOrdinalSuffix = (rank) => {
        const j = rank % 10;
        const k = rank % 100;
        if (j === 1 && k !== 11) return "st";
        if (j === 2 && k !== 12) return "nd";
        if (j === 3 && k !== 13) return "rd";
        return "th";
    };

    return (
        <div className="welcome">
            <h2>Welcome, {stats.username}!</h2>
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
                    <p className="stat-value">{stats.multiplier}X</p>
                </div>
                <div className="stat-card">
                    <h3>Current Global Rank</h3>
                    <p className="stat-value">
                        {stats.rank <= 10 && stats.rank !== '-' 
                        ? `${stats.rank}${getOrdinalSuffix(stats.rank)}` 
                        : `#${stats.rank}`}
                        </p>
                </div>
            </div>
        </div>
    )
}

export default Welcome
