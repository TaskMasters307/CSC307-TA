import React, { useState } from 'react';
import { FetchSignUp } from './httpUltilities';
import { Is_User_Name_Exist } from './Utilities';
import logo from '../assets/taskarena-logo.jpeg';
import '../css/LoginSignup.css';

function Signup({ closeForm, LoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    async function CreateAccount(account) {
        try {
            const exists = await Is_User_Name_Exist(username);
            
            if (exists) {
                setError('Account already exists');
                return;
            }

            const response = await FetchSignUp(account);
            
            if (response.token) {
                // Store the token in localStorage
                localStorage.setItem('token', response.token);
                alert('Account created successfully');
                LoginSuccess();
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('Failed to create account. Please try again.');
        }
    }

    function handleSignup(e) {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        const account = { 
            username: username, 
            password: password 
        };
        
        CreateAccount(account);
    }

    return (
        <div className="Signup-Form" id="myForm">
            <img src={logo} alt="Task Arena" className="task-arena-logo" />
            <h1 className="Signup-header">Sign Up</h1>
            <form className="Signup-form">
                <label className="login-label">
                    <b>Username</b>
                </label>
                <input
                    type="text"
                    placeholder="Enter Username"
                    name="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className="login-label">
                    <b>Password</b>
                </label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                    <p className={`signup-error-message ${error ? 'animate' : ''}`}>
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    className="login-button"
                    onClick={handleSignup}
                >
                    Sign up
                </button>
                <button
                    type="button"
                    className="btn cancel"
                    onClick={closeForm}
                >
                    Close
                </button>
            </form>
        </div>
    );
}

export default Signup;