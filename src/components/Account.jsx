import React, { useEffect, useState } from "react";
import AccountDetails from "./AccountDetails";

const Account = () => {
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const [token, setToken] = useState({});
    const [tokenPresent, setTokenPresent] = useState(false);

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
            if (response.ok) {
                const accessToken = tokenObj.token;
                setToken(accessToken);
                localStorage.setItem('token', accessToken);
                localStorage.setItem('username', registerUsername);

                setTokenPresent(true);
            } else {
                console.error('Registration failed', tokenObj);
            }

            setRegisterName('');
            setRegisterEmail('');
            setRegisterUsername('');
            setRegisterPassword('');
        } catch (error) {
            console.error('Error during registration, Sorry!', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setTokenPresent(!!token);
    }, []);

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

            localStorage.setItem('username', inputUsername);
            setInputUsername('');
            setInputPassword('');

            const object = await userResponse.json();

            if (userResponse.ok) {
                const accessToken = object.token;
                setToken(accessToken);
                localStorage.setItem('token', accessToken);
                setTokenPresent(true);
            } else {
                console.error('Login failed:', object);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logOut = () => {
        localStorage.removeItem('token');
        setTokenPresent(false);
    };

    return (
        <div>
            {tokenPresent ? (
                <>
                    <AccountDetails />
                    <button onClick={logOut}>Logout</button>
                </>
            ) : (
                <>
                    <form onSubmit={register}>
                        <h1>New User Registration</h1>
                        <input type="text" name="name" value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="First Name" required />
                        <input type="email" name="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="Email" required />
                        <input name="username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} placeholder="Username" required />
                        <input type="password" name="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" required />
                        <button type="submit">Register</button>
                    </form>
                    <form onSubmit={login}>
                        <h1>Login</h1>
                        <input name="username" value={inputUsername} onChange={(e) => setInputUsername(e.target.value)} placeholder="Username" required />
                        <input type="password" name="password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} placeholder="Password" required />
                        <button type="submit">Log In</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Account;
