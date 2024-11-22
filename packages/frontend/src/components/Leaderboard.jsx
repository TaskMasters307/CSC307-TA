import React, { useState, useEffect } from 'react';
import { addAuthHeader } from './httpUtilities'; // Helper function to include auth token

/**
 * Leaderboard Component
 * Fetches and displays user rankings from the backend
 */

const Leaderboard = () => {
  const [users, setUsers] = useState([]); // State to store leaderboard data
  const [error, setError] = useState(null);

  // Fetch leaderboard data from the backend
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/leaderboard', {
        method: 'GET',
        headers: addAuthHeader(), // Include auth token in headers
      });

      if (response.status === 200) {
        const data = await response.json();
        setUsers(data); // Assuming the backend returns an array of users
      } else if (response.status === 401) {
        setError('Unauthorized. Please log in to view the leaderboard.');
      } else {
        setError('Failed to fetch leaderboard data. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Unable to connect to the server. Please try again later.');
    }
  };

  // Fetch leaderboard data when the component mounts
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {error && <p className="error-message">{error}</p>}
      {!error && users.length === 0 && <p>Loading leaderboard...</p>}
      <div className="leaderboard-list">
        {users.map((user) => (
          <div key={user.id} className="leaderboard-item">
            <div className="rank">#{user.rank}</div>
            <div className="username">{user.username}</div>
            <div className="points">{user.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
