import React, { useState } from 'react'
import { MatchAccount } from './Utilities'

const Login = ({ onLoginSuccess, PopSignup }) => {
    // Accept onLoginSuccess prop
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function LoginCheck(account) {
        try{
            const result = await MatchAccount(account);
            if(result.status === 404){
                setError('Account not Found');
            } else {
                onLoginSuccess(result.data.username, result.data.stats);
            }
        } catch (error) {
                console.log('Login error: ',error);
                setError('Login failed. Please try again.');
            }
    }

    const handleLogin = (e) => {
        e.preventDefault()

        if (!username || !password) {
            setError('Username and password are required.')
            return
        }
        const account = { username: username, password: password }
        LoginCheck(account)
    }

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
                            setUsername(e.target.value)
                            setError('') // Reset error on input change
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
                            setPassword(e.target.value)
                            setError('') // Reset error on input change
                        }}
                        className="login-input"
                        placeholder="Enter your password"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">
                    Login
                </button>
                <button className="open-button" onClick={PopSignup}>
                    Sign up
                </button>
            </form>
        </div>
    )
}
export default Login
