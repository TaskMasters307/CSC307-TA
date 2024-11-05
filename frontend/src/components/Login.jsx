import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => { // Accept onLoginSuccess prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleLogin = (e) => {
      e.preventDefault();
  
      if (!username || !password) {
        setError('Username and password are required.');
        return;
      }
  
      if (username === 'testuser' && password === 'password') {
        alert('Login successful!');
        onLoginSuccess(); // Call success function to update state in App
      } else {
        onLoginSuccess();
      }
    };
  
    return (
        <div className="login-container">
          <h2 className="login-header">Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label className="login-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(''); // Reset error on input change
                }}
                className="login-input"
                placeholder="Enter your username"
              />
            </div>
            <div className="input-group">
              <label className="login-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Reset error on input change
                }}
                className="login-input"
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      );
    };
export default Login;