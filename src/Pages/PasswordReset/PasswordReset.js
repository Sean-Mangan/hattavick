import { Paper, Box, Button, Alert, AlertTitle } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import TextField from "@mui/material/TextField";
import "./PasswordReset.css";
import { useSetPasswordMutation } from "../../features/auth/authApiSlice";

function PasswordReset() {
  // rtk query hooks
  const [resetPassword] = useSetPasswordMutation();
  const { reset_id } = useParams();

  // Some helpful state
  const [psw, setPsw] = useState("");
  const [pswConfirm, setPswConfirm] = useState("");
  const [passError, setPassError] = useState("");
  const [Error, setError] = useState("");
  const [succ, setSucc] = useState(false);

  /**
   * Will handle the new password
   * @param {*} e
   * @param {*} type
   */
  const handleChange = (e, type) => {
    if (type === "psw") {
      setPsw(e.target.value);
      if (e.target.value.length < 8) {
        setPassError("Password must have 8 characters");
      } else if (e.target.value !== pswConfirm) {
        setPassError("Password must match");
      } else {
        setPassError("");
      }
    } else {
      setPswConfirm(e.target.value);
      if (psw.length < 8) {
        setPassError("Password must have 8 characters");
      } else if (psw !== e.target.value) {
        setPassError("Password must match");
      } else {
        setPassError("");
      }
    }
  };

  /**
   * Will attempt to perform the password update
   * @param {*} e
   * @returns
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passError !== "") {
      return null;
    }
    try {
      await resetPassword({ password: psw, reset_id: reset_id }).unwrap();
      setSucc(true);
    } catch (e) {
      setError(
        "Some error occured when reseting, this link maybe expired. Try again!",
      );
    }
  };

  return (
    <Paper elevation={12} className="reset_wrapper">
      {!succ ? (
        <>
          <Alert
            className="reset_err"
            onClose={() => {
              setError("");
            }}
            style={Error !== "" ? { textAlign: "left" } : { display: "none" }}
            severity="error"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Oops, an error occured</strong> — {Error}
          </Alert>
          <p className="reset_title">Password Reset</p>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Box className="reset_box">
              <LockIcon
                fontSize="large"
                className="login_form_icon"
                sx={{ color: "action.active", mr: 1 }}
              />
              <TextField
                value={psw}
                className="login_text_box"
                type="password"
                label="Password"
                variant="filled"
                onChange={(e) => handleChange(e, "psw")}
                required
              />
            </Box>
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
                value={pswConfirm}
                onChange={(e) => handleChange(e, "conf")}
                required
              />
            </Box>
            <Box>
              <a style={{ color: "red", display: passError }}>{passError}</a>
            </Box>
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
        <>
          <p className="reset_title">Success!</p>
          <p>Your Password has successfully been reset, try logging in!</p>
          <img
            style={{ maxWidth: "100%" }}
            src="https://i.pinimg.com/originals/6e/34/f0/6e34f0027ae54a25873e2e07cf0aafb2.gif"
          />
        </>
      )}
    </Paper>
  );
}

export default PasswordReset;
