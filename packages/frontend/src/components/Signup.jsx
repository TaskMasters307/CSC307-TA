import React, { useState } from 'react';
import { Is_User_Name_Exist } from './Utilities';
import { FetchSignUp } from './httpUltilities';

function Signup({ closeForm, LoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9]{3,20}$/; // Allows 3-20 alphanumeric characters
        return usernameRegex.test(username);
    };

    async function CreateAccount(account) {
        Is_User_Name_Exist(username)
            .then((exist) => {
                if (exist) {
                    setError('Username already exists.');
                } else {
                    FetchSignUp(account)
                        .then((res) => {
                            if (res.status === 500) {
                                setError('Error creating account.');
                            } else {
                                alert('Account created successfully!');
                                LoginSuccess();
                            }
                        })
                        .catch((error) => {
                            console.error('Error during sign-up:', error);
                        });
                }
            })
            .catch(() => {
                console.error('Error checking username existence.');
                setError('An error occurred. Please try again.');
            });
    }

    function handleSignup(e) {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        if (!validateUsername(username)) {
            setError(
                'Username must be 3-20 characters long and contain only alphanumeric characters.'
            );
            return;
        }

        if (!validatePassword(password)) {
            setError(
                'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.'
            );
            return;
        }

        const account = { username, password };
        CreateAccount(account);
    }

    return (
        <div className="Signup-Form" id="myForm">
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
                ></input>

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
                ></input>

                {error && (
                    <p
                        className={`signup-error-message ${error ? 'animate' : ''}`}
                    >
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
