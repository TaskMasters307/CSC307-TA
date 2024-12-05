// src/components/Leaderboard.jsx
import React, { useState, useEffect } from 'react'
import '../css/Leaderboard.css'
import deployment from './env.jsx'  

const API_URL = deployment 
    ? "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
    : "http://localhost:8001";

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted=true;
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users/leaderboard`);
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard data');
                }
                const data = await response.json();
                if (isMounted){
                    setLeaderboardData(data);
                    setIsLoading(false);
                }
      } catch (err) {
            console.error('Leaderboard fetch error:', err);
            if (isMounted) {  // Only update state if component is mounted
                setError(err.message);
                setIsLoading(false);
            }
      }
    };

        fetchLeaderboard();
        // Refresh leaderboard every 10 seconds
        const interval = setInterval(fetchLeaderboard, 10000);
        return () => {isMounted=false; clearInterval(interval);};
    }, []);

    if (isLoading) return <div className="leaderboard-loading">Loading...</div>;
    if (error) return <div className="leaderboard-error">{error}</div>;

    const renderTrophy = (rank) => {
        switch (rank) {
          case 1:
            return <span className="trophy rank-1">🏆</span>; // Gold trophy
          case 2:
            return <span className="trophy rank-2">🥈</span>; // Silver trophy
          case 3:
            return <span className="trophy rank-3">🥉</span>; // Bronze trophy
          default:
            return null; // No trophy for other ranks
        }
      };

    return (
        <div className="leaderboard-container">
        <h2 className="leaderboard-title">Top Players</h2>
        <div className="leaderboard-table">
          <div className="leaderboard-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Points</span>
          </div>
          {leaderboardData.map((user, index) => (
            <div
              key={index} 
              className={`leaderboard-row ${
                index === 0
                  ? "rank-1"
                  : index === 1
                  ? "rank-2"
                  : index === 2
                  ? "rank-3"
                  : ""
              }`}
            >
              <span>
                {renderTrophy(index + 1)}
                #{index + 1}</span> 
              <span className="username">{user.username || "Anonymous"}</span> 
              <span className="points">{user.points || 0}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Leaderboard;