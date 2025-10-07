import { useState } from "react";
import {
  useDeleteCampaignMutation,
  useGetCampaignsQuery,
  useLeaveCampaignMutation,
} from "../../features/campaign/campaignApiSlice";
import { useNavigate } from "react-router-dom";
import "./CampaignManagementPage.css";
import {
  Alert,
  AlertTitle,
  Button,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LaunchIcon from "@mui/icons-material/Launch";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

const CampaignManagementPage = () => {
  // Campaign API hooks
  const { data: campaigns, isSuccess, isLoading } = useGetCampaignsQuery();
  const [deleteCampaign, { isLoading: delLoading }] = useDeleteCampaignMutation(
    { fixedCacheKey: "delete-campaign" },
  );
  const [leaveCampaign] = useLeaveCampaignMutation();

  // Navigation hook
  const navigate = useNavigate();

  // Component state
  const [delCampaignName, setDelCampaignName] = useState("");
  const [delVerify, setDelVerify] = useState("");
  const [delCampaignId, setDelCampaignId] = useState("");
  const [error, setError] = useState("");

  /**
   * Clears the deletion modal state
   */
  const clearDeletionState = () => {
    setDelCampaignId("");
    setDelCampaignName("");
    setDelVerify("");
  };

  /**
   * Handles campaign deletion after user confirmation
   */
  const handleDelete = async () => {
    try {
      await deleteCampaign(delCampaignId).unwrap();
      clearDeletionState();
    } catch (err) {
      const errMsg = err?.data?.error
        ? err?.data?.error
        : "An unknown error occurred, try again or contact support";
      setError(errMsg);
    }
  };

  /**
   * Handles leaving a campaign (for non-owner users)
   * @param {string} campaignId - ID of the campaign to leave
   */
  const handleLeave = async (campaignId) => {
    try {
      await leaveCampaign(campaignId).unwrap();
      clearDeletionState();
    } catch (err) {
      const errMsg = err?.data?.error
        ? err?.data?.error
        : "An unknown error occurred, try again or contact support";
      setError(errMsg);
    }
  };

  /**
   * Renders a row for campaigns owned by the user (with full controls)
   * @param {Object} campaignData - Campaign information
   */
  const OwnerRow = ({ campaignData }) => {
    return (
      <div className="owner-row">
        <div className="campaign-name-title">
          <strong>{campaignData.name}</strong>
        </div>
        <Button
          variant="contained"
          onClick={() => navigate(`/campaign/${campaignData.id}`)}
          startIcon={<LaunchIcon />}
        >
          Launch
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => {
            setDelCampaignName(campaignData.name);
            setDelCampaignId(campaignData.id);
          }}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          startIcon={<AddBusinessIcon />}
          color="secondary"
          disabled
        >
          Add to Market Place
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(`/campaign/${campaignData.id}/settings`)}
          startIcon={<SettingsApplicationsIcon />}
          color="success"
        >
          Settings
        </Button>
      </div>
    );
  };

  /**
   * Renders a row for campaigns where user is admin/player (limited controls)
   * @param {Object} campaignData - Campaign information
   */
  const RegularRow = ({ campaignData }) => {
    return (
      <div className="owner-row">
        <div className="campaign-name-title">
          <strong>{campaignData.name}</strong>
        </div>
        <Button
          variant="contained"
          onClick={() => navigate(`/campaign/${campaignData.id}`)}
          startIcon={<LaunchIcon />}
        >
          Launch
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={() => {
            handleLeave(campaignData.id);
          }}
        >
          Leave
        </Button>
      </div>
    );
  };

  return (
    <div className="campaign-management-wrap">
      {!isLoading && campaigns && (
        <>
          {delCampaignName !== "" && (
            <div className="delete-campaign-wrap">
              <Paper elevation={10} className="delete-campaign-box">
                <div className="close-icon-wrap">
                  <Button
                    onClick={clearDeletionState}
                    startIcon={<CloseIcon />}
                    style={{ color: "black" }}
                    size="l"
                  />
                </div>
                <h3>
                  Enter the name of the campaign ({delCampaignName}) to delete.
                </h3>
                <TextField
                  placeholder={delCampaignName}
                  value={delVerify}
                  onChange={(e) => setDelVerify(e.target.value)}
                ></TextField>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="error"
                  disabled={delVerify !== delCampaignName || delLoading}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Paper>
            </div>
          )}
          <h1>Campaigns</h1>
          {error && (
            <Alert
              className="login_err"
              onClose={() => setError("")}
              style={{ textAlign: "left", marginBottom: "1em" }}
              severity="error"
            >
              <AlertTitle>Error</AlertTitle>
              <strong>Oops, an error occurred</strong> — {error}
            </Alert>
          )}
          {campaigns.owner.length !== 0 && (
            <Paper elevation={10} className="campaign-management-box-wrap">
              <div className="owner-title-wrap">
                <div className="campaign-management-box-title">
                  <strong>Owned Campaigns</strong>
                </div>
                <Button
                  startIcon={<AddBoxIcon className="add-icon" />}
                  variant="contained"
                  color="error"
                  className="add-btn"
                  style={{ backgroundColor: "#21b6ae" }}
                  onClick={() => navigate("/create")}
                >
                  New
                </Button>
              </div>
              {isSuccess &&
                (campaigns.owner ?? []).map((item) => (
                  <OwnerRow campaignData={item} key={item.id} />
                ))}
            </Paper>
          )}
          <br />
          {campaigns.admin.length !== 0 && (
            <Paper elevation={10} className="campaign-management-box-wrap">
              <div className="owner-title-wrap">
                <div className="campaign-management-box-title">
                  <strong>Admin Campaigns</strong>
                </div>
              </div>
              {isSuccess &&
                (campaigns.admin ?? []).map((item) => (
                  <RegularRow campaignData={item} key={item.id} />
                ))}
            </Paper>
          )}
          <br />
          {campaigns.player.length !== 0 && (
            <Paper elevation={10} className="campaign-management-box-wrap">
              <div className="owner-title-wrap">
                <div className="campaign-management-box-title">
                  <strong>Player Campaigns</strong>
                </div>
              </div>
              {isSuccess &&
                (campaigns.player ?? []).map((item) => (
                  <RegularRow campaignData={item} key={item.id} />
                ))}
            </Paper>
          )}
        </>
      )}
    </div>
  );
};

export default CampaignManagementPage;
