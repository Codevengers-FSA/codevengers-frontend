import React, { useEffect, useState } from "react";
import AccountDetails from "./AccountDetails";

const Account = () => {
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const [token, setToken] = useState(localStorage.getItem('token') || {});
    const [tokenPresent, setTokenPresent] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        setTokenPresent(!!localStorage.getItem('token'));
    }, []);

    const register = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch('https://codevengers-backend.onrender.com/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: registerName,
                    email: registerEmail,
                    username: registerUsername,
                    password: registerPassword
                }),
            });
    
            const tokenObj = await response.json();
            console.log('Register response:', tokenObj); // Log the response object
    
            if (response.ok && tokenObj.user) {
                const accessToken = tokenObj.token;
                const userId = tokenObj.user.id;
    
                setToken(accessToken);
                localStorage.setItem('token', accessToken);
                localStorage.setItem('userId', userId);
                localStorage.setItem('username', registerUsername);
    
                console.log("User ID stored in local storage:", userId);
                setTokenPresent(true);
            } else {
                console.error('Invalid registration response:', tokenObj);
            }
    
            setRegisterName('');
            setRegisterEmail('');
            setRegisterUsername('');
            setRegisterPassword('');
        } catch (error) {
            console.error('Error during registration, Sorry!', error);
        }
    };
    
    const login = async (event) => {
        event.preventDefault();
    
        try {
            const userResponse = await fetch('https://codevengers-backend.onrender.com/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: inputUsername,
                    password: inputPassword
                })
            });
    
            const object = await userResponse.json();
            console.log('Login response:', object); // Log the response object
    
            if (userResponse.ok && object.user) {
                const accessToken = object.token;
                const userId = object.user.id;
    
                setToken(accessToken);
                localStorage.setItem('token', accessToken);
                localStorage.setItem('userId', userId);
                localStorage.setItem('username', inputUsername);
    
                console.log("User ID stored in local storage:", userId);
                setTokenPresent(true);
            } else {
                console.error('Invalid login response:', object);
            }
    
            setInputUsername('');
            setInputPassword('');
        } catch (error) {
            console.error('Error during login:', error);
        }
    };    

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setTokenPresent(false);
    };

    return (
        <div className="auth-container">
        {tokenPresent ? (
          <div className="account-details">
            <AccountDetails />
            <button className="logout-button" onClick={logOut}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-forms">
            <form className="auth-form" onSubmit={register}>
              <h1 className="form-title">New User Registration</h1>
              <input
                className="auth-input"
                type="username"
                name="name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="First Name"
                required
              />
              <input
                className="auth-input"
                type="email"
                name="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                className="auth-input"
                name="username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                className="auth-input"
                type="password"
                name="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button className="auth-button" type="submit">
                Register
              </button>
            </form>
            <form className="auth-form" onSubmit={login}>
              <h1 className="form-title">Login</h1>
              <input
                className="auth-input"
                name="username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                className="auth-input"
                type="password"
                name="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button className="auth-button" type="submit">
                Log In
              </button>
            </form>
          </div>
        )}
      </div>
    );
};

export default Account;