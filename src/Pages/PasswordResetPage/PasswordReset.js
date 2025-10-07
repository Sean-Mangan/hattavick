import { Paper, Box, Button, Alert, AlertTitle } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import TextField from "@mui/material/TextField";
import "./PasswordReset.css";
import { useSetPasswordMutation } from "../../features/auth/authApiSlice";
import Settings from "../../config/settings.json";

/**
 * PasswordReset component allows users to reset their password via email link.
 * Validates password length and matching confirmation before submission.
 *
 * @returns {JSX.Element} The password reset page
 */
function PasswordReset() {
  // RTK query hooks
  const [resetPassword] = useSetPasswordMutation();
  const { reset_id } = useParams();

  // State variables
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /**
   * Validates password based on length and matching confirmation.
   *
   * @param {string} pwd - The password to validate
   * @param {string} pwdConfirm - The password confirmation
   * @returns {string} Error message if validation fails, empty string otherwise
   */
  const validatePassword = (pwd, pwdConfirm) => {
    if (pwd.length < Settings.AUTH.MIN_PASSWORD_LENGTH) {
      return `Password must have ${Settings.AUTH.MIN_PASSWORD_LENGTH} characters`;
    } else if (pwd !== pwdConfirm) {
      return "Password must match";
    }
    return "";
  };

  /**
   * Handles password input change and validation.
   *
   * @param {Event} e - The input change event
   * @param {string} type - The type of input ('password' or 'confirm')
   */
  const handleChange = (e, type) => {
    if (type === "password") {
      setPassword(e.target.value);
      const errorMsg = validatePassword(e.target.value, passwordConfirm);
      setPasswordError(errorMsg);
    } else {
      setPasswordConfirm(e.target.value);
      const errorMsg = validatePassword(password, e.target.value);
      setPasswordError(errorMsg);
    }
  };

  /**
   * Handles password reset form submission.
   *
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError) {
      return null;
    }
    try {
      await resetPassword({ password: password, reset_id: reset_id }).unwrap();
      setSuccess(true);
    } catch (error) {
      setError(
        "Some error occurred when resetting, this link maybe expired. Try again!",
      );
    }
  };

  return (
    <Paper elevation={12} className="reset_wrapper">
      {!success ? (
        <>
          {/* Error alert */}
          <Alert
            className="reset_err"
            onClose={() => {
              setError("");
            }}
            style={error ? { textAlign: "left" } : { display: "none" }}
            severity="error"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Oops, an error occurred</strong> — {error}
          </Alert>

          {/* Password reset form */}
          <p className="reset_title">Password Reset</p>
          <form onSubmit={(e) => handleSubmit(e)}>
            {/* Password input */}
            <Box className="reset_box">
              <LockIcon
                fontSize="large"
                className="login_form_icon"
                sx={{ color: "action.active", mr: 1 }}
              />
              <TextField
                value={password}
                className="login_text_box"
                type="password"
                label="Password"
                variant="filled"
                onChange={(e) => handleChange(e, "password")}
                required
              />
            </Box>

            {/* Confirm password input */}
            <Box className="reset_box">
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
                value={passwordConfirm}
                onChange={(e) => handleChange(e, "confirm")}
                required
              />
            </Box>

            {/* Password error display */}
            <Box>
              <span
                style={{
                  color: "red",
                  display: passwordError ? "block" : "none",
                }}
              >
                {passwordError}
              </span>
            </Box>

            {/* Submit button */}
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "cyan",
                color: "#3b3b3b",
                marginBottom: "2em",
                marginTop: "2em",
              }}
            >
              <strong>Submit</strong>
            </Button>
          </form>
        </>
      ) : (
        /* Success state */
        <>
          <p className="reset_title">Success!</p>
          <p>Your Password has successfully been reset, try logging in!</p>
          <img
            style={{ maxWidth: "100%" }}
            src={Settings.IMAGES.SUCCESS_GIF_URL}
            alt="Success celebration animation"
          />
        </>
      )}
    </Paper>
  );
}

export default PasswordReset;
