import React, { useEffect, useState } from 'react';
import '../css/Welcome.css';

const URL = "http://localhost:8001"; // Change to your backend URL

/**
 * Welcome Component
 * Landing page that displays user welcome message and quick access to main features
 */
const Welcome = ({ setCurrentView, userId, username = 'User' }) => {
    const [userStats, setUserStats] = useState({
        totalPoints: 0,
        tasksCompleted: 0,
    });

    useEffect(() => {
        if (userId) {
            fetchUserStats(userId);
        }
    }, [userId]);

    const fetchUserStats = async (id) => {
        try {
            const response = await fetch(`${URL}/users/${id}/stats`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user stats: ${response.status}`);
            }
            const data = await response.json();
            setUserStats(data);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    return (
        <div className="welcome">
            <h2>Welcome, {username}!</h2>
            <div className="stats-summary">
                <div className="stat-card">
                    <h3>Your Points</h3>
                    <p className="stat-value">{userStats.totalPoints}</p>
                </div>
                <div className="stat-card">
                    <h3>Tasks Completed</h3>
                    <p className="stat-value">{userStats.tasksCompleted}</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
