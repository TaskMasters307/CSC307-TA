import { useState } from "react";

function Signup({ closeForm, LoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function CreateAccount(account) {
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      });

      if (response.status === 409) {
        setError("Account already exists.");
      } else if (response.status === 201) {
        const { token } = await response.json();

        // Save the JWT token
        localStorage.setItem("authToken", token);
        alert("Account created successfully!");

        // Notify parent of success (log in the user automatically)
        LoginSuccess();

        // Clear form
        setUsername('');
        setPassword('');
        setError(null);
      } else {
        throw new Error("Error creating account. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  }

  function handleSignup(e) {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    const account = { username, password };
    CreateAccount(account);
  }

  return (
    <div className="Signup-Form" id="myForm">
      <h1 className="Signup-header">Sign Up</h1>
      <form className="Signup-form" onSubmit={handleSignup}>
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
          <p className={`signup-error-message ${error ? "animate" : ""}`}>
            {error}
          </p>
        )}
        <button type="submit" className="login-button">
          Sign up
        </button>
        <button type="button" className="btn cancel" onClick={closeForm}>
          Close
        </button>
      </form>
    </div>
  );
}

export default Signup;
