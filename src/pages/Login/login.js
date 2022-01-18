import React, {useState} from 'react';

import { Grid,Paper, Avatar, TextField, Button, Alert } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';


const Login=({setLogin,setName})=>{

    var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/login'
    const alt = 'background prop'

    const [xCoords, setXCoords] = useState(0)
    const [yCoords, setYCoords] = useState(0)
    const [errd, setErrd] = useState(false)

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
                setName(response.name)
                setLogin(true)
            } else{
                setErrd(true)
            }
            } catch (err) {
                console.log(err)
            }
    }


    const paperStyle={padding:20, height:'40%',width:"280px", margin:"12% auto"}
    const avatarStyle={backgroundColor:'black'}
    const btnstyle={margin:'8px 0px'}
    const errorstyle = {margin:'8px 8px'}

    return(
        <div >
            <Grid>
                <form onSubmit={handleSubmit}>
                    <Paper elevation={10} style={paperStyle}>
                        <Grid align='center'>
                        {(errd) ? <Alert style={errorstyle} severity="error">No user with that name found</Alert> : <></>}
                            <Avatar style={avatarStyle}><LocalFireDepartmentIcon/></Avatar>
                            <h2>Sign In</h2>
                        </Grid>
                        <TextField label='Name' name="name" placeholder='Enter Name' fullWidth required/>
                        <Button type='submit' color='error' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                    </Paper>
                </form>
            </Grid>
        </div>
    )
}

export default Login