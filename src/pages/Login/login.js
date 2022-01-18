import React from 'react';

import './login.css';

function LoginPage({setLogin,setName}) {

    var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/login'
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const nameInput = event.target.name.value;
        console.log(nameInput)
        login(nameInput);
    };
  
    async function login(name){
        try{
            var response = await fetch(uri, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'name': name}),
                })
            response = await response.json()
            console.log(response)
            if (response.name){
                setLogin(true)
            } 
            } catch (err) {
                console.log(err)
            }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" required />
            <input type="submit" />
        </form>
    )
}

export default LoginPage;