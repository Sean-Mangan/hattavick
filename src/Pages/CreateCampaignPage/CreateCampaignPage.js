import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import "./CreateCampaignPage.css";
import { useCreateCampaignMutation } from "../../features/campaign/campaignApiSlice";
import LoadingScreen from "../../Components/Loading/LoadingScreen";
import { useRefreshMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function CreateCampaignPage() {
  // Some helpful mutations
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();
  const [refresh] = useRefreshMutation();

  // setting the state for a refresh
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Using some state vars to keep track of inputs and responses
  const [campaignName, setCampaignName] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  /**
   * Attempt to create the campaign
   * @param {*} e
   */
  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      const newCampaign = await createCampaign({ name: campaignName }).unwrap();
      const data = await refresh().unwrap();
      dispatch(setCredentials(data));
      navigate(`/campaign/${newCampaign.campaign_id}`);
    } catch (e) {
      setErr(e.data?.error);
    }
  };

  return (
    <>
      {isLoading ? <LoadingScreen background={"transparent"} /> : <></>}
      <Alert
        className="campaign_create_err"
        onClose={() => {
          setErr("");
        }}
        style={err !== "" ? { textAlign: "left" } : { display: "none" }}
        severity="error"
      >
        <AlertTitle>Error</AlertTitle>
        <strong>Oops, an error occured</strong> — {err}
      </Alert>
      <div className="create_campaign_wrapper">
        {!success ? (
          <>
            <h1>Create a Campaign</h1>
            <form onSubmit={(e) => handle_submit(e)}>
              <TextField
                placeholder="Enter Campaign Name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                inputProps={{ maxLength: 64 }}
                style={{ width: "100%" }}
                required
              />
              <br />
              <Button
                style={{ marginTop: "2rem" }}
                type="submit"
                variant="contained"
                color="error"
              >
                Submit
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1>Success!</h1>
            <p>You have successfully created a Campaign!</p>
            <img
              style={{ maxWidth: "100%" }}
              src="https://i.pinimg.com/originals/6e/34/f0/6e34f0027ae54a25873e2e07cf0aafb2.gif"
            />
          </>
        )}
      </div>
    </>
  );
}

export default CreateCampaignPage;
