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
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation, useResetPasswordMutation } from '../../features/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';


function LoginPage({reload}) {

  // New Login functionality
  const [register, {isSuccess: registerSuccess}] = useRegisterMutation()
  const [login] = useLoginMutation()
  const [resetPassword] = useResetPasswordMutation()
  const dispatch = useDispatch()

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

  /**
   * Function that will handle login/registering functionality
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      // Handle the password reset request
      if (passReset) {
        const email = loginData.email
        await resetPassword(email).unwrap()
        setResetSent(true)
        return
      }

      // Handle registering functionality
      if (isRegister){
        const payload = {email : loginData.email, password: loginData.password}
        const userData = await register(payload).unwrap()
        const email = loginData.email
        return
      }

      // Otherwise it must be a login function
      const payload = {email : loginData.email, password: loginData.password}
      const userData = await login(payload).unwrap()
      const email = loginData.email
      dispatch(setCredentials({ ...userData, email}))
      navigate(from, {replace: true});

    }catch (err){
      const errMsg = (err?.data?.error) ? err?.data?.error : "An unkown error occured, try again or contact support"
      setError(errMsg)
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
        <form onSubmit={(e) => handleSubmit(e)}>
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
            {!(registerSuccess) ?
              <>
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
                </>
              }
              </>
              :
              <>
              <Box className='icon_box' style={{padding: "1em"}}>
                <img
                style={{maxWidth: "100%", margin:"auto"}}
                src="https://i.pinimg.com/originals/6e/34/f0/6e34f0027ae54a25873e2e07cf0aafb2.gif"/>
                <br/><br/>
                <a style={{color: "rgba(0, 0, 0, 0.80)"}} 
                      className='login_password_reset'>
                      You have been registered, please check your email for a verification email to get started.
                </a>
                <br/><br/>
                <a style={{color: "rgba(0, 0, 0, 0.80)"}} 
                  className='login_password_reset'>
                  <strong>Make sure to check your spam folder!</strong>
                </a>
              </Box>
              </>
            }
            </Paper>
        </form>
      </div>
    </div>
  )
}

export default LoginPage