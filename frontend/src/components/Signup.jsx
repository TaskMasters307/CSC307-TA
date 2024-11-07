import { useState } from "react";

function Signup({closeForm, LoginSuccess}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleLogin (e) {
        e.preventDefault();
  
      if (!username || !password) {
        setError('Username and password are required.');
        return;
      }
  
      if (username === 'username' && password === 'password') {
        alert('Login successful!');
        LoginSuccess(); // Call success function to update state in App
      } else {
        LoginSuccess();
      }
    }

    
    return (
        
        <div className="Signup-Form" id="myForm">
        
        <h1 className="Signup-header">Sign Up</h1>
        <form className="Signup-form">
        <label className="login-label" ><b>Username</b></label>
        <input type="text" placeholder="Enter Username" name="username" required value={username}   onChange={(e) =>{setUsername(e.target.value);  console.log(username)}} ></input>
        
        <label className="login-label" ><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="password" required value={password}  onChange={(e) => {setPassword(e.target.value)}} ></input>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button" onClick = {handleLogin}>Login</button>
        <button type="button" className="btn cancel" onClick={closeForm} >Close</button>
        </form>
        </div>
    )
    
}
export default Signup