import React, {useState} from 'react'
import './LoginPage.css';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import LockIcon from '@mui/icons-material/Lock';
import {Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from '../../api/axios';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import useAuth from '../../hooks/useAuth';
import {useNavigate, useLocation } from 'react-router-dom';

const LOGIN_URL = "/login"
const REGISTER_URL = "/register"
const RESET_URL = "/resetPassword"


function LoginPage({reload}) {

  const {auth, setAuth} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"

  const [loginData, setLoginData] = useState({"email": "", "password": ""})
  const [passError, setPassError] = useState("")
  const [Error, setError] = useState("")
  const [confPass, setConfPass] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [passReset, setPassReset] = useState(false)
  const [resetSent, setResetSent] = useState(false)


  function handle_login(e) {
    e.preventDefault()
    if (passReset){

      const payload = {email : loginData.email}
      axios.post(RESET_URL, 
        payload,
        {
          withCredentials: true,
          headers: {crossDomain: true}
        }).then(()=> {
          setResetSent(true)
        }).catch(()=>{
          setResetSent(true)
        })

    }else{
      if (isRegister){
        if (loginData.password.length < 8){
          setPassError("Password must have 8 characters")
          return
        }else if (loginData.password !== confPass){
          setPassError("Password must match")
          return
        }
        else{
          const payload = {email : loginData.email, password: loginData.password}
          axios.post(REGISTER_URL, 
            payload,
            {
              withCredentials: true,
              headers: {crossDomain: true}
            }).then((res) => {
              const access_token = res?.data?.accessToken
              const email = loginData.email
              const pwd = loginData.password
              setAuth({access_token})
              reload()
              navigate(from, {replace: true});
          }).catch((err) => {
              if (err?.response?.status === 407){
                setError("Account already exists")
              }else{
              setError("Failed to register")
            }
          })
        }
      }else{
        const payload = {email : loginData.email, password: loginData.password}
        axios.post(LOGIN_URL, 
          payload, 
          {
            withCredentials: true,
            headers: {crossDomain: true}
          }).then((res) => {
            const access_token = res?.data?.accessToken
            const email = loginData.email
            const pwd = loginData.password
            setAuth({access_token})
            reload()
            navigate(from, {replace: true});
          }).catch((err) => {
            console.log(err)
            if (err?.response?.status === 429){
              setError("Too many failed attempts. Reset your password")
            }else{
              setError("Failed to login")
            }
          }
        )
      }
    }
  }

  function handleSwitch(){
      setConfPass("")
      setPassError("")
      setIsRegister(!isRegister)
      setLoginData({"email": "", "password": ""})
  }

  function handleConfPassChange(event){
    const passd = event.target.value
    if (passd !== loginData.password) {
      setPassError("Password must match")
    }else if (passd.length >= 8){
      setPassError("")
    }
  }
  

  function handleInputChange(event, name){
    if (name === "email"){
      setLoginData(prevState => ({
        ...prevState,
        [name]: event.target.value
      }));
    }
    if (name === "password"){
      setLoginData(prevState => ({
        ...prevState,
        [name]: event.target.value
      }));

      if ((event.target.value.length < 8) && isRegister){
        setPassError("Password must have 8 characters")
      }else if ((event.target.value !== confPass) && isRegister){
        setPassError("Password must match")
      }
      else{
        setPassError("")
      }

    }
  }

  return (
    <div className='login_wrapper'>
      <div className="login_form_wrapper">
        <form onSubmit={(e) => handle_login(e)}>
          <CloseIcon 
            sx={{fontSize: "5vh"}} 
            className="close_icon" 
            onClick={() => window.location.href = "/"} 
            />
          <Paper className='form_field_wrapper' elevation={12}>
          <Alert 
              className='login_err'
              onClose={() => {setError("")}} style={(Error !== "") ? {textAlign:"left"} : {display: "none"}} 
              severity="error"
            >
                <AlertTitle>Error</AlertTitle>
                <strong>Oops, an error occured</strong> — {Error}
            </Alert>
            {(!passReset) ?
            <>
              <h2 className="login_title" style={{display: (!isRegister) ? "block": "none", marginTop: (Error !== "") ? "none": "auto"}}>Login</h2>
              <h2 className="login_title" style={{display: (isRegister) ? "block": "none", marginTop: (Error !== "") ? "none": "auto"}}>Register</h2>
              <Box className='icon_box'>
                <EmailIcon fontSize="large" className='login_form_icon' sx={{ color: 'action.active', mr: 1}}/>
                <TextField 
                value={loginData.email} 
                className="login_text_box" 
                size='large' 
                type="email" 
                label="Email" 
                variant="filled" 
                onChange={(event) => handleInputChange(event, "email")}
                required />
              </Box>
              <Box className='icon_box'>
                <LockIcon fontSize="large" className='login_form_icon' sx={{ color: 'action.active', mr: 1}}/>
                <TextField 
                value={loginData.password} 
                className="login_text_box" 
                type="password" 
                label="Password" 
                variant="filled" 
                onChange={(event) => handleInputChange(event, "password")}
                required />
              </Box>
              <Box className='icon_box' 
              style={{display: (isRegister) ? "block": "none"}}
              >
                <LockIcon fontSize="large" className='login_form_icon' sx={{ color: 'action.active', mr: 1}}/>
                <TextField 
                className="login_text_box" 
                type="password" 
                label="Confirm Password" 
                variant="filled" 
                value={confPass}
                onChange={(event)=> {setConfPass(event.target.value); handleConfPassChange(event)}}
                required={isRegister} 
                />
              </Box>
              <Box>
                <a style={{color:"red", display: (passError)}}>{passError}</a>
              </Box>

              <Grid container className="password_control">
                <Grid item xs={6}>
                  <a 
                  style={{color:"darkblue"}} 
                  className='login_password_reset' 
                  onClick={handleSwitch}
                  >
                    {(isRegister) ? "Login now" : "Register now"}
                  </a>                
                </Grid>
                <Grid item xs={6}>
                  <a style={{color: "rgba(0, 0, 0, 0.80)"}} 
                  className='login_password_reset' 
                  onClick={() => setPassReset(!passReset)}
                  >Forgot password?</a>
                </Grid>
              </Grid>
              <br/>
              <Button 
              type="submit" 
              variant='contained'
              style={{backgroundColor:"cyan", color:"#3b3b3b", marginBottom:"2em"}} 
              > <strong>Submit</strong></Button>
              </> 
              : 
              <>
                <h2 className="login_title" style={{marginTop: (Error !== "") ? "none": "auto"}}>Reset Password</h2>
                {(!resetSent) ?
                <> 
                  <Box className='icon_box'>
                    <EmailIcon fontSize="large" className='login_form_icon' sx={{ color: 'action.active', mr: 1}}/>
                    <TextField 
                    value={loginData.email} 
                    className="login_text_box" 
                    size='large' 
                    type="email" 
                    label="Email" 
                    variant="filled" 
                    onChange={(event) => handleInputChange(event, "email")}
                    required />
                  </Box>
                  <Grid container className="password_control">
                    <Grid item xs={12}>
                      <a style={{color: "rgba(0, 0, 0, 0.80)", color:"darkblue"}} 
                      className='login_password_reset' 
                      onClick={() => {setPassReset(!passReset); setIsRegister(false)}}
                      >Back to login</a>
                    </Grid>
                  </Grid>
                  <br/>
                  <Button 
                  type="submit" 
                  variant='contained'
                  style={{backgroundColor:"cyan", color:"#3b3b3b", marginBottom:"2em"}} 
                  > <strong>Submit</strong></Button>
                </> : 
                <>
                <Box className='icon_box' style={{paddingBottom: "2em"}}>
                <a style={{color: "rgba(0, 0, 0, 0.80)"}} 
                  className='login_password_reset'>
                  If a user with that email exists in our system, a password reset email will be sent to them.
                </a>
                <br/><br/>
                <a style={{color: "rgba(0, 0, 0, 0.80)"}} 
                  className='login_password_reset'>
                  <strong>Make sure to check your spam folder!</strong>
                </a>
                </Box>
                </>
              }
              </>}
            </Paper>
        </form>
      </div>
    </div>
  )
}

export default LoginPage