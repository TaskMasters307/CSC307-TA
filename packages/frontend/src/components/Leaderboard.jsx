// src/components/Leaderboard.jsx
import React, { useState, useEffect } from 'react'
import '../css/Leaderboard.css'

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`/api/leaderboard`);
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard data');
                }
                const data = await response.json();
                setLeaderboardData(data);
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to load leaderboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
        // Refresh leaderboard every 10 seconds
        const interval = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) return <div className="leaderboard-loading">Loading...</div>;
    if (error) return <div className="leaderboard-error">{error}</div>;

    return (
        <div className="leaderboard-container">
            <h2>Top Players</h2>
            <div className="leaderboard-table">
                <div className="leaderboard-header">
                    <div>Rank</div>
                    <div>Player</div>
                    <div>Points</div>
                    <div>Tasks</div>
                </div>
                {leaderboardData.map((player, index) => (
                    <div 
                        key={player.username} 
                        className={`leaderboard-row ${
                            player.username === userId ? 'current-user' : ''}`}
                    >
                        <div className="rank">
                            {player.rank <= 3 ? (
                                <span className={`trophy rank-${player.rank}`}>
                                    {player.rank === 1 ? '🏆' : player.rank === 2 ? '🥈' : '🥉'}
                                </span>
                            ) : (
                                `#${player.rank}`
                            )}
                        </div>
                        <div className="username">{player.username}</div>
                        <div className="points">{player.statistics.totalPoints}</div>
                        <div className="tasks">{player.statistics.tasksCompleted}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Leaderboard
