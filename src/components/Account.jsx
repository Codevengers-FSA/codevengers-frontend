import { useState } from "react";

const Account = ()=>{
    
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('')
    const [token, setToken] = useState({})

const register = async ()=>{
    
};
register();
const login = async (event) => {
    event.preventDefault();
    const userResponse = await fetch('', {
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
    };


    return (
        <>
        <h1>New User Registration</h1>
    
        <form>
            <input type="text" placeholder="First Name" required></input>
            <input type = "email" placeholder="Email" required></input>
            <input placeholder="username" required ></input>
            <input type="password" placeholder="Password" required/>
            <button type="submit">Register</button>
        </form>
  
  
        <h1>Login!</h1>
        <form onSubmit={login}>
            <input type= "username" placeholder="username"
            onChange={((event)=>{setInputUsername(event.target.value)})}
            value={inputUsername} />

            <input type="password" placeholder="password"
            onChange={((event)=>{setInputPassword(event.target.value)})}
            value={inputPassword} />
            <button>Log In!</button>
          
        </form>

        </>
    )
};


export default Account;