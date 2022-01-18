import React from 'react';

import './login.css';

function LoginPage({setLogin,setName}) {

    const uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/login'

    const handleSubmit = (event) => {
        event.preventDefault();
        const nameInput = event.target.name.value;
        console.log(nameInput)
        login(nameInput);
    };
  
    function login(name){
        try{
            fetch(uri, {
                method: 'post', 
                body: JSON.stringify({'name': name}),
                headers: {
                    'Access-Control-Allow-Origin':'*'
                }
                })
                .then(response => response.json())
                .then(data => console.log(data))
                //{if (data.body.name) setLogin(true)}
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