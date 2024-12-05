import React, { useState } from 'react';
import { Is_User_Name_Exist } from './Utilities'
import { FetchSignUp } from './httpUltilities'

function Signup({ closeForm, LoginSuccess }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    async function CreateAccount(account) {
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
                                    LoginSuccess(data.userId); // Pass the userId to LoginSuccess
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
            //console.log("account= " , account);
            CreateAccount(account)

            /* if(!Is_User_Name_Exist(username)) {
        console.log("creating account");
        postUser(account).
        then((res) => {
        //console.log(res.status);
        if(res.status === 500) {
          throw new Error("error ading user");
        }
        else {
          console.log(res.json());
          return res.json();
        }
        
        }).then((data) => {

          alert(`Sign up successful`);
        }).catch((error) => {
          console.log("catching error:", error);
        })
      }
      else {
        //alert("Username already exsits");
      } */
        }
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
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
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
    )
}
export default Signup
