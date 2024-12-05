import React, { useState } from 'react';
import { Is_User_Name_Exist } from './Utilities'
import { FetchSignUp } from './httpUltilities'
import logo from '../assets/taskarena-logo.jpeg';
import '../css/LoginSignup.css'

function Signup({ closeForm, LoginSuccess }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    // Password validation function
    const validatePassword = (password) => {
        const minLength = 8;
        const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
        
        const errors = [];
        
        if (password.length < minLength) {
            errors.push(`Password must be at least ${minLength} characters long`);
        }
        
        if (!specialChars.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        return errors;
    };

    async function CreateAccount(account) {
        // First validate password
        const passwordErrors = validatePassword(account.password);
        if (passwordErrors.length > 0) {
            setError(passwordErrors.join('. '));
            return;
        }

        Is_User_Name_Exist(username)
            .then((exist) => {
                if (exist) {
                    setError('Account already exists');
                } else {
                    FetchSignUp(account)
                        .then((res) => {
                            if (res.status === 500) {
                                setError('Error: Unable to create account');
                                throw new Error('PostUser error 500');
                            } else {
                                res.json().then((data) => {
                                    alert('Account created successfully');
                                    LoginSuccess(data.userId);
                                });
                            }
                        })
                        .catch((error) => {
                            console.log('Error during account creation:', error);
                        });
                }
            })
            .catch((error) => {
                console.log('Error checking username existence:', error);
            });
    }

    function handleSignup(e) {
        e.preventDefault()
        setError(null)
        if (!username || !password) {
            setError('Username and password are required.')
            return
        } else {
            const account = { username: username, password: password }
            CreateAccount(account)
        }
    }

    return (
        <div> <img src={logo} alt="Task Arena" className="task-arena-logo" />
            <div className="login-container">
            <h2 className="Signup-header">Sign Up</h2>
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
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                ></input>

                <label className="login-label">
                    <b>Password</b>
                </label>
                <input
                    type="password"
                    placeholder="Enter Password (min 8 chars, 1 special char)"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
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
        </div>
    )
}

export default Signup