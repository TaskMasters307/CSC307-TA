import React, { useState } from 'react';
import { FetchLogin } from '../httpUltilities';

const Login = ({ onLoginSuccess, PopSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const LoginCheck = async (account) => {
        try {
            const res = await FetchLogin(account);

            if (res.status === 404) {
                setError('Account not found.');
            } else if (res.status === 401) {
                setError('Incorrect password.');
            } else if (res.status === 200) {
                const user = await res.json(); // Get user details from response
                onLoginSuccess(user); // Call the login success handler with user data
            } else {
                setError('Unexpected error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Failed to log in. Please try again.');
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        const account = { username, password };
        LoginCheck(account);
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
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Login;

