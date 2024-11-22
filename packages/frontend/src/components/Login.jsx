import React, { useState } from 'react';
import Signup from './Signup';
import { addAuthHeader } from './httpUtilities'; // For future authenticated requests

const Login = ({ onLoginSuccess, PopSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const token = data.token;

        // Store token in localStorage
        localStorage.setItem('authToken', token);

        // Notify parent component of successful login
        onLoginSuccess();

        // Clear form inputs
        setUsername('');
        setPassword('');
        setError('');
      } else if (response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Unable to connect to the server. Please try again.');
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
        <button type="button" className="open-button" onClick={PopSignup}>
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Login;
