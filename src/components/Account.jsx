import React, { useEffect, useState } from "react";


const Account = () => {


    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('')

    const [token, setToken] = useState({})
    
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
            
            setRegisterName('');
            setRegisterEmail('');
            setRegisterUsername('');
            setRegisterPassword('');
            
            const tokenObj = await response.json();
            if (response.ok) {
                
                const accessToken = tokenObj.token;
                setToken(accessToken);
                localStorage.setItem('token', accessToken)
                
                
            } else {
                console.error('Registration failed', tokenObj);
            }
        } catch (error) {
            console.error('Error during registration, Sorry!', error);
        }
    };
    
    useEffect(()=>{
        const token = localStorage.getItem('token');
        setTokenPresent(!!token);
    }, [])

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
            })
            
            setInputUsername('');
            setInputPassword('')
            
            const object = await userResponse.json();
            
            if (userResponse.ok) {
                const accessToken = object.token
                setToken(accessToken)
                localStorage.setItem('token', accessToken)
                setTokenPresent(true)
            } else {
                console.error('Login failed:', object);
            }
        } catch (error) {
            console.error('Error during login:', error)
        }
    };
    
    const logOut = () =>{
        localStorage.removeItem('token')
        setTokenPresent(false);
    }

return (

        <>
        
        {!tokenPresent && (
            
            <form onSubmit={register}>
                <h1>New User Registration</h1>
                <input type="text" placeholder="First Name"
                    onChange={((event) => { setRegisterName(event.target.value) })}
                    value={registerName} required></input>

                <input type="email" placeholder="Email"
                    onChange={((event) => { setRegisterEmail(event.target.value) })}
                    value={registerEmail} required></input>

                <input placeholder="username"
                    onChange={((event) => { setRegisterUsername(event.target.value) })}
                    value={registerUsername} required ></input>

                <input type="password" placeholder="Password"
                    onChange={((event) => { setRegisterPassword(event.target.value) })}
                    value={registerPassword} required />

                <button type="submit">Register</button>
            </form>
            )}

        {!tokenPresent && (

            
            <form onSubmit={login}>
                <h1>Login!</h1>

                <input type="username" placeholder="username"
                    onChange={((event) => { setInputUsername(event.target.value) })}
                    value={inputUsername} required/>

                <input type="password" placeholder="password"
                    onChange={((event) => { setInputPassword(event.target.value) })}
                    value={inputPassword} required/>
                    </form>
        )}
                {!tokenPresent ?
                (<button onClick={login}>Log In!</button>)
                :
                (<button onClick={logOut}>Logout</button>)
                }

        </>
    )

};



export default Account;
