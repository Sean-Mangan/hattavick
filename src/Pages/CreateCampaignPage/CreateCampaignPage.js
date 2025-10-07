import { Button, TextField } from "@mui/material";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import "./CreateCampaignPage.css";
import { useCreateCampaignMutation } from "../../features/campaign/campaignApiSlice";
import LoadingScreen from "../../Components/Loading/LoadingScreen";
import { useRefreshMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Settings from "../../config/settings.json";

/**
 * CreateCampaignPage component
 * Allows users to create a new campaign with a custom name
 */
function CreateCampaignPage() {
  // API mutations for campaign creation and token refresh
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();
  const [refresh] = useRefreshMutation();

  // Redux and navigation hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Component state
  const [campaignName, setCampaignName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /**
   * Handles form submission to create a new campaign
   * Creates campaign, refreshes auth token, and navigates to the new campaign
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the campaign
      const newCampaign = await createCampaign({ name: campaignName }).unwrap();

      // Refresh authentication token to include new campaign in user data
      const data = await refresh().unwrap();
      dispatch(setCredentials(data));

      // Navigate to the newly created campaign
      navigate(`/campaign/${newCampaign.campaign_id}`);
    } catch (err) {
      console.error("Failed to create campaign:", err);
      setError(
        err.data?.error || "Failed to create campaign. Please try again.",
      );
    }
  };

  return (
    <>
      {/* Loading overlay while creating campaign */}
      {isLoading && <LoadingScreen background="transparent" />}

      {/* Error alert */}
      {error && (
        <Alert
          className="campaign_create_err"
          onClose={() => setError("")}
          style={{ textAlign: "left" }}
          severity="error"
        >
          <AlertTitle>Error</AlertTitle>
          <strong>Oops, an error occurred</strong> — {error}
        </Alert>
      )}

      <div className="create_campaign_wrapper">
        {!success ? (
          <>
            <h1>Create a Campaign</h1>
            <form onSubmit={handleSubmit}>
              <TextField
                placeholder="Enter Campaign Name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                inputProps={{
                  maxLength: Settings.VALIDATION.MAX_CAMPAIGN_NAME_LENGTH,
                }}
                style={{ width: "100%" }}
                required
              />
              <br />
              <Button
                style={{ marginTop: "2rem" }}
                type="submit"
                variant="contained"
                color="error"
                disabled={isLoading}
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
              src={Settings.IMAGES.SUCCESS_GIF_URL}
              alt="Success celebration"
            />
          </>
        )}
      </div>
    </>
  );
}

export default CreateCampaignPage;
