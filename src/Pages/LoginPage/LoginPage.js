import { useState } from "react";
import "./LoginPage.css";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import LockIcon from "@mui/icons-material/Lock";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useLoginMutation,
  useRegisterMutation,
  useResetPasswordMutation,
} from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { replayFailedRequests } from "../../app/api/apiSlice";
import Settings from "../../config/settings.json";

function LoginPage({ reload }) {
  // API hooks for authentication operations
  const [register, { isSuccess: registerSuccess }] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [resetPassword] = useResetPasswordMutation();
  const dispatch = useDispatch();

  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Form state management
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [passError, setPassError] = useState("");
  const [error, setError] = useState(""); // Fixed: was 'Error' (capitalized)
  const [confPass, setConfPass] = useState("");

  // UI state management
  const [isRegister, setIsRegister] = useState(false);
  const [passReset, setPassReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  /**
   * Handles form submission for login, registration, or password reset
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Handle password reset flow
      if (passReset) {
        await resetPassword(loginData.email).unwrap();
        setResetSent(true);
        return;
      }

      // Handle registration flow
      if (isRegister) {
        const payload = {
          email: loginData.email,
          password: loginData.password,
          name: loginData.username,
        };
        await register(payload).unwrap();
        return;
      }

      // Handle login flow
      const payload = { email: loginData.email, password: loginData.password };
      const userData = await login(payload).unwrap();
      dispatch(setCredentials({ ...userData, email: loginData.email }));
      replayFailedRequests();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Authentication error:", err);
      const errMsg = err?.data?.error
        ? err?.data?.error
        : "An unknown error occurred, try again or contact support";
      setError(errMsg);
    }
  };

  /**
   * Toggles between login and register modes, clearing form data
   */
  const handleSwitch = () => {
    setConfPass("");
    setPassError("");
    setIsRegister(!isRegister);
    setLoginData({ email: "", password: "", username: "" });
  };

  /**
   * Validates the confirmation password field
   * @param {Event} event - Input change event
   */
  const handleConfPassChange = (event) => {
    const password = event.target.value;
    if (password !== loginData.password) {
      setPassError("Passwords must match");
    } else if (password.length >= Settings.AUTH.MIN_PASSWORD_LENGTH) {
      setPassError("");
    }
  };

  /**
   * Handles input changes for all form fields and validates password
   * @param {Event} event - Input change event
   * @param {string} name - Name of the field being updated (email, username, or password)
   */
  const handleInputChange = (event, name) => {
    const value = event.target.value;

    // Update the form data for the specific field
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate password field during registration
    if (name === "password" && isRegister) {
      if (value.length < Settings.AUTH.MIN_PASSWORD_LENGTH) {
        setPassError(
          `Password must have at least ${Settings.AUTH.MIN_PASSWORD_LENGTH} characters`
        );
      } else if (value !== confPass) {
        setPassError("Passwords must match");
      } else {
        setPassError("");
      }
    }
  };

  return (
    <div className="login_wrapper">
      <div className="login_form_wrapper">
        <form onSubmit={(e) => handleSubmit(e)}>
          <CloseIcon
            sx={{ fontSize: "5vh" }}
            className="close_icon"
            onClick={() => (window.location.href = "/")}
          />
          <Paper className="form_field_wrapper" elevation={12}>
            <Alert
              className="login_err"
              onClose={() => setError("")}
              style={error !== "" ? { textAlign: "left" } : { display: "none" }}
              severity="error"
            >
              <AlertTitle>Error</AlertTitle>
              <strong>Oops, an error occurred</strong> — {error}
            </Alert>
            {!registerSuccess ? (
              <>
                {!passReset ? (
                  <>
                    <h2
                      className="login_title"
                      style={{
                        display: !isRegister ? "block" : "none",
                        marginTop: error !== "" ? "none" : "auto",
                      }}
                    >
                      Login
                    </h2>
                    <h2
                      className="login_title"
                      style={{
                        display: isRegister ? "block" : "none",
                        marginTop: error !== "" ? "none" : "auto",
                      }}
                    >
                      Register
                    </h2>
                    <Box className="icon_box">
                      <EmailIcon
                        fontSize="large"
                        className="login_form_icon"
                        sx={{ color: "action.active", mr: 1 }}
                      />
                      <TextField
                        value={loginData.email}
                        className="login_text_box"
                        size="large"
                        type="email"
                        label="Email"
                        variant="filled"
                        onChange={(event) => handleInputChange(event, "email")}
                        required
                        inputProps={{
                          maxLength: Settings.AUTH.MAX_EMAIL_LENGTH,
                        }}
                      />
                    </Box>
                    <Box
                      className="icon_box"
                      style={{ display: isRegister ? "block" : "none" }}
                    >
                      <PersonOutlineIcon
                        fontSize="large"
                        className="login_form_icon"
                        sx={{ color: "action.active", mr: 1 }}
                      />
                      <TextField
                        value={loginData.username}
                        className="login_text_box"
                        type="text"
                        label="Username"
                        variant="filled"
                        onChange={(event) =>
                          handleInputChange(event, "username")
                        }
                        required={isRegister}
                        inputProps={{
                          maxLength: Settings.AUTH.MAX_USERNAME_LENGTH,
                        }}
                      />
                    </Box>
                    <Box className="icon_box">
                      <LockIcon
                        fontSize="large"
                        className="login_form_icon"
                        sx={{ color: "action.active", mr: 1 }}
                      />
                      <TextField
                        value={loginData.password}
                        className="login_text_box"
                        type="password"
                        label="Password"
                        variant="filled"
                        onChange={(event) =>
                          handleInputChange(event, "password")
                        }
                        required
                        inputProps={{
                          maxLength: Settings.AUTH.MAX_PASSWORD_LENGTH,
                        }}
                      />
                    </Box>
                    <Box
                      className="icon_box"
                      style={{ display: isRegister ? "block" : "none" }}
                    >
                      <LockIcon
                        fontSize="large"
                        className="login_form_icon"
                        sx={{ color: "action.active", mr: 1 }}
                      />
                      <TextField
                        className="login_text_box"
                        type="password"
                        label="Confirm Password"
                        variant="filled"
                        value={confPass}
                        onChange={(event) => {
                          setConfPass(event.target.value);
                          handleConfPassChange(event);
                        }}
                        required={isRegister}
                        inputProps={{
                          maxLength: Settings.AUTH.MAX_PASSWORD_LENGTH,
                        }}
                      />
                    </Box>
                    <Box>
                      <a style={{ color: "red", display: passError }}>
                        {passError}
                      </a>
                    </Box>
                    <br />
                    {isRegister ? (
                      <FormControlLabel
                        style={{ maxWidth: "90%", paddingBottom: "1em" }}
                        labelPlacement="end"
                        control={<Checkbox required={isRegister} />}
                        label={
                          <>
                            <span>I accept the </span>
                            <a
                              href={Settings.EXTERNAL_URLS.TERMS_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              terms of use
                            </a>
                            <span> and </span>
                            <a
                              href={Settings.EXTERNAL_URLS.PRIVACY_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              privacy policy
                            </a>
                            <span> and am 13 or older</span>
                          </>
                        }
                      />
                    ) : null}
                    <br />
                    <Button
                      type="submit"
                      variant="contained"
                      style={{
                        backgroundColor: "cyan",
                        color: "#3b3b3b",
                        marginBottom: "2em",
                      }}
                    >
                      {" "}
                      <strong>Submit</strong>
                    </Button>
                    <Grid container className="password_control">
                      <Grid item xs={6}>
                        <a
                          style={{ color: "darkblue" }}
                          className="login_password_reset"
                          onClick={handleSwitch}
                        >
                          {isRegister ? "Login now" : "Register now"}
                        </a>
                      </Grid>
                      <Grid item xs={6}>
                        <a
                          style={{ color: "rgba(0, 0, 0, 0.80)" }}
                          className="login_password_reset"
                          onClick={() => setPassReset(!passReset)}
                        >
                          Forgot password?
                        </a>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    <h2
                      className="login_title"
                      style={{ marginTop: error !== "" ? "none" : "auto" }}
                    >
                      Reset Password
                    </h2>
                    {!resetSent ? (
                      <>
                        <Box className="icon_box">
                          <EmailIcon
                            fontSize="large"
                            className="login_form_icon"
                            sx={{ color: "action.active", mr: 1 }}
                          />
                          <TextField
                            value={loginData.email}
                            className="login_text_box"
                            size="large"
                            type="email"
                            label="Email"
                            variant="filled"
                            onChange={(event) =>
                              handleInputChange(event, "email")
                            }
                            required
                          />
                        </Box>
                        <Grid container className="password_control">
                          <Grid item xs={12}>
                            <a
                              style={{
                                color: "rgba(0, 0, 0, 0.80)",
                                color: "darkblue",
                              }}
                              className="login_password_reset"
                              onClick={() => {
                                setPassReset(!passReset);
                                setIsRegister(false);
                              }}
                            >
                              Back to login
                            </a>
                          </Grid>
                        </Grid>
                        <br />
                        <Button
                          type="submit"
                          variant="contained"
                          style={{
                            backgroundColor: "cyan",
                            color: "#3b3b3b",
                            marginBottom: "2em",
                          }}
                        >
                          {" "}
                          <strong>Submit</strong>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Box
                          className="icon_box"
                          style={{ paddingBottom: "2em" }}
                        >
                          <a
                            style={{ color: "rgba(0, 0, 0, 0.80)" }}
                            className="login_password_reset"
                          >
                            If a user with that email exists in our system, a
                            password reset email will be sent to them.
                          </a>
                          <br />
                          <br />
                          <a
                            style={{ color: "rgba(0, 0, 0, 0.80)" }}
                            className="login_password_reset"
                          >
                            <strong>
                              Make sure to check your spam folder!
                            </strong>
                          </a>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Box className="icon_box" style={{ padding: "1em" }}>
                  <img
                    style={{ maxWidth: "100%", margin: "auto" }}
                    src={Settings.IMAGES.SUCCESS_GIF_URL}
                    alt="Registration successful"
                  />
                  <br />
                  <br />
                  <a
                    style={{ color: "rgba(0, 0, 0, 0.80)" }}
                    className="login_password_reset"
                  >
                    You have been registered, please check your email for a
                    verification email to get started.
                  </a>
                  <br />
                  <br />
                  <a
                    style={{ color: "rgba(0, 0, 0, 0.80)" }}
                    className="login_password_reset"
                  >
                    <strong>Make sure to check your spam folder!</strong>
                  </a>
                </Box>
              </>
            )}
          </Paper>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
