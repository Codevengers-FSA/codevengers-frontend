import { useState } from "react";

const LogInForm = () => {

    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('')
    const [token, setToken] = useState({})
    
    const login = async (event) => {
        event.preventDefault();
        const userResponse = await fetch('https://codevengers-backend.onrender.com/users', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: inputUsername,
                password: inputPassword
            })
        })

        setInputUsername('');
        setInputPassword('')

        const object = await userResponse.json();
        const accessToken = object.token
        { console.log(token) }
        setToken(accessToken)
        localStorage.setItem('token', accessToken)
    }

    return (
        
        <form onSubmit={login}>
            <input type= "username" placeholder="username"
            onChange={((event)=>{setInputUsername(event.target.value)})}
            value={inputUsername} />

            <input type="password" placeholder="password"
            onChange={((event)=>{setInputPassword(event.target.value)})}
            value={inputPassword} />
            <button>Log In!</button>
          
        </form>
    )
};

export default LogInForm;