import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./SettingsPage.css";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  useDeleteCampaignMutation,
  useGetCampaignQuery,
  useGetInviteLinkMutation,
  useKickPlayerMutation,
  useLeaveCampaignMutation,
  useSendInviteMutation,
} from "../../../features/campaign/campaignApiSlice";
import Settings from "../../../config/settings.json";

/**
 * SettingsPage component for managing campaign settings.
 * Provides different options based on user role:
 * - Owner: Can delete campaign, invite players, kick players
 * - Admin: Can invite players, kick players
 * - Player: Can leave campaign
 *
 * @returns {JSX.Element} The campaign settings page
 */
function SettingsPage() {
  // Grab permissions from context
  const { campaignId, isOwner, isAdmin } = useOutletContext();

  // RTK Query hooks
  const [deleteCampaign] = useDeleteCampaignMutation({
    fixedCacheKey: "delete-campaign",
  });
  const [getInviteLink] = useGetInviteLinkMutation({
    fixedCacheKey: "get-invite",
  });
  const [leaveCampaign] = useLeaveCampaignMutation({
    fixedCacheKey: "leave-campaign",
  });
  const [sendInvite] = useSendInviteMutation({ fixedCacheKey: "send-invite" });
  const [kickPlayer] = useKickPlayerMutation({ fixedCacheKey: "kick-player" });
  const { data: campaign } = useGetCampaignQuery(campaignId, campaignId, {
    skip: !isAdmin,
  });

  // Navigation for successful deletion or leaving
  const navigate = useNavigate();

  // State variables
  const [delCount, setDelCount] = useState(Settings.UI.DELETE_COUNT_INITIAL);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  /**
   * Handles campaign deletion with confirmation.
   * First click increments delete count, second click confirms deletion.
   */
  const handleDelete = async () => {
    if (delCount === Settings.UI.DELETE_COUNT_INITIAL) {
      setDelCount(Settings.UI.DELETE_COUNT_CONFIRM);
      return;
    }

    // Attempt to delete the campaign
    try {
      await deleteCampaign(campaignId).unwrap();
      navigate("/");
    } catch (error) {
      alert(error.data.error);
    }
  };

  /**
   * Attempts to kick the given player from the campaign.
   *
   * @param {string} playerEmail - The email of the player to kick
   */
  const handleKickPlayer = async (playerEmail) => {
    try {
      await kickPlayer({
        campaignId,
        formData: { email: playerEmail },
      }).unwrap();
      alert(`Successfully kicked ${playerEmail}`);
    } catch (error) {
      alert(error.data.error);
    }
  };

  /**
   * Generates an invite link for the campaign.
   */
  const getInviteLinkHandler = async () => {
    try {
      const result = await getInviteLink(campaignId).unwrap();
      setInviteLink(result.url);
    } catch (error) {
      console.error("Failed to get invite link:", error);
    }
  };

  /**
   * Handles user leaving the campaign with confirmation.
   * First click increments delete count, second click confirms leaving.
   */
  const handleLeave = async () => {
    if (delCount === Settings.UI.DELETE_COUNT_INITIAL) {
      setDelCount(Settings.UI.DELETE_COUNT_CONFIRM);
      return;
    }
    try {
      await leaveCampaign(campaignId).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to leave campaign:", error);
    }
  };

  /**
   * Sends a campaign invite to the specified email address.
   *
   * @param {Event} e - The form submit event
   */
  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await sendInvite({
        campaignId,
        formData: { invite_address: inviteEmail },
      }).unwrap();
      alert("Successfully sent invite email");
    } catch (error) {
      console.error("Failed to send invite:", error);
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-title">Settings</div>

      {/* Admin section - invites and player management */}
      {isAdmin && (
        <div>
          {/* Email invite form */}
          <form onSubmit={(e) => handleInvite(e)}>
            <div className="settings-option-label">Email Invite:</div>
            <TextField
              sx={{ width: "100%" }}
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              type="email"
              required
              label="Email"
            />
            <Button
              type="submit"
              variant="contained"
              style={{ marginTop: "0.5em" }}
              value="Send Invite"
            >
              Send Invite
            </Button>
          </form>

          {/* Link invite */}
          <div className="settings-option-label">Link Invite:</div>
          {inviteLink && (
            <TextField
              sx={{ width: "100%" }}
              value={inviteLink}
              onChange={(e) => null}
            />
          )}
          <Button variant="contained" onClick={() => getInviteLinkHandler()}>
            Generate Invite Link
          </Button>

          {/* Player removal section */}
          {campaign.players.length !== 0 && (
            <>
              <div className="settings-option-label">Remove Players:</div>
              {campaign.players.map((item) => {
                return (
                  <div key={item} className="kick-player-box">
                    <Button
                      variant="outlined"
                      color="error"
                      endIcon={<PersonRemoveIcon />}
                      onClick={() => handleKickPlayer(item)}
                    >
                      {item}
                    </Button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Owner section - campaign deletion */}
      {isOwner && (
        <div className="settings-del-btn-wrap">
          <div className="settings-option-label">Delete Campaign:</div>
          <Button
            onClick={() => handleDelete()}
            variant="contained"
            style={{ marginTop: "0.5em" }}
            color="error"
          >
            {delCount === Settings.UI.DELETE_COUNT_INITIAL
              ? "Delete Campaign"
              : "Are You Sure?"}
          </Button>
        </div>
      )}

      {/* Player section - leave campaign */}
      {!(isOwner || isAdmin) && (
        <div className="settings-del-btn-wrap">
          <div className="settings-option-label">Leave Campaign:</div>
          <Button
            onClick={() => handleLeave()}
            variant="contained"
            style={{ marginTop: "0.5em" }}
            color="error"
          >
            {delCount === Settings.UI.DELETE_COUNT_INITIAL
              ? "Leave Campaign"
              : "Are You Sure?"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
