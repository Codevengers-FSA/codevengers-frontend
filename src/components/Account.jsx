import { useState } from "react";

const Account = () => {
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('')
    const [token, setToken] = useState({})

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

    const login = async (event) => {
        event.preventDefault();

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
        const accessToken = object.token

        setToken(accessToken)
        localStorage.setItem('token', accessToken)
      
    };


    return (
        <>
            <h1>New User Registration</h1>

            <form onSubmit={register}>
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


            <h1>Login!</h1>
            <form onSubmit={login}>

                <input type="username" placeholder="username"
                    onChange={((event) => { setInputUsername(event.target.value) })}
                    value={inputUsername} />

                <input type="password" placeholder="password"
                    onChange={((event) => { setInputPassword(event.target.value) })}
                    value={inputPassword} />

                <button>Log In!</button>

            </form>
        </>
    )
};


export default Account;