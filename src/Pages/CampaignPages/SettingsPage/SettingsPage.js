import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
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

function SettingsPage() {
  // Grab some perms from the context
  const { campaignId, isOwner, isAdmin } = useOutletContext();

  // Some RTK query hooks
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

  // Navigation for successful deletion
  const navigate = useNavigate();

  // Some helpful state vars
  const [delCount, setDelCount] = useState(0);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  /**
   * Will iterate the delete count or delete
   * @returns
   */
  const handleDelete = async () => {
    if (delCount === 0) {
      setDelCount(1);
      return;
    }

    // Attempt to delete the campaign
    try {
      await deleteCampaign(campaignId).unwrap();
      navigate("/");
    } catch (e) {
      alert(e.data.error);
    }
  };

  /**
   * Will attempt to kick the given player
   * @returns
   */
  const handleKickPlayer = async (playerEmail) => {
    // Attempt to delete the campaign
    try {
      await kickPlayer({
        campaignId,
        formData: { email: playerEmail },
      }).unwrap();
      alert(`Successfully kicked ${playerEmail}`);
    } catch (e) {
      alert(e.data.error);
    }
  };

  /**
   * Will attempt to get an invite link to share
   */
  const get_invite_link = async () => {
    try {
      const result = await getInviteLink(campaignId).unwrap();
      setInviteLink(result.url);
    } catch (e) {}
  };

  /**
   * Will attempt to have the user leave the given campaign
   */
  const handleLeave = async () => {
    if (delCount === 0) {
      setDelCount(1);
      return;
    }
    try {
      await leaveCampaign(campaignId).unwrap();
      navigate("/");
    } catch (e) {}
  };

  /**
   * Will attempt to send a player invite
   * @param {*} e
   */
  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await sendInvite({
        campaignId,
        formData: { invite_address: inviteEmail },
      }).unwrap();
      alert("Successfully sent invite invite email");
    } catch (e) {}
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-title">Settings</div>
      {isAdmin ? (
        <div>
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
          <div className="settings-option-label">Link Invite:</div>
          {inviteLink !== "" ? (
            <TextField
              sx={{ width: "100%" }}
              value={inviteLink}
              onChange={(e) => null}
            />
          ) : (
            <></>
          )}
          <Button variant="contained" onClick={() => get_invite_link()}>
            Generate Invite Link
          </Button>

          {/* Handle Removing players */}
          {campaign.players.length !== 0 ? (
            <>
              <div className="settings-option-label">Remove Players:</div>
              {campaign.players.map((item) => {
                return (
                  <div key={{ item }} className="kick-player-box">
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
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      {isOwner ? (
        <div className="settings-del-btn-wrap">
          <div className="settings-option-label">Delete Campaign:</div>
          <Button
            onClick={() => handleDelete()}
            variant="contained"
            style={{ marginTop: "0.5em" }}
            color="error"
          >
            {delCount === 0 ? "Delete Campaign" : "Are You Sure?"}
          </Button>
        </div>
      ) : (
        <></>
      )}
      {!(isOwner || isAdmin) ? (
        <div className="settings-del-btn-wrap">
          <div className="settings-option-label">Leave Campaign:</div>
          <Button
            onClick={() => handleLeave()}
            variant="contained"
            style={{ marginTop: "0.5em" }}
            color="error"
          >
            {delCount === 0 ? "Leave Campaign" : "Are You Sure?"}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SettingsPage;
