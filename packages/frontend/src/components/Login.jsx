import React, { useState } from 'react';
//import Signup from './Signup';
//import { Is_User_Name_Exist, MatchAccount } from './Utilities';
import '../css/LoginSignup.css'
import { FetchLogin } from './httpUltilities';
const Login = ({ onLoginSuccess, PopSignup }) => { // Accept onLoginSuccess prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    async function FetchLogin(account) {
      try {
          const response = await fetch(`http://localhost:8001/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(account),
          });
  
          console.log("Raw Response:", response); // Debugging: Log raw response
  
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Login failed: ${response.status} - ${errorText}`);
          }
  
          const data = await response.json();
          console.log("Parsed Response Data:", data); // Debugging: Log parsed response
          return data;
      } catch (error) {
          console.error("Error in FetchLogin:", error); // Debugging: Log error
          throw error;
      }
  }
  

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
        setError("Username and password are required");
        return;
    }

    try {
        const data = await FetchLogin({ username, password });
        console.log("Login successful:", data); // Debugging: Log success response
        onLoginSuccess(data.userId); // Pass userId to the parent component
    } catch (error) {
        console.error("Login failed:", error); // Debugging: Log error
        setError(error.message || "Login failed. Please try again."); // Show detailed error
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
            <button className="open-button" onClick={PopSignup} >Sign up</button>
          </form>
        </div>
      );
    };
export default Login;