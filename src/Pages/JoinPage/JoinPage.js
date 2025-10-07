import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./JoinPage.css";
import {
  useGetCampaignQuery,
  useJoinCampaignMutation,
} from "../../features/campaign/campaignApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { useRefreshMutation } from "../../features/auth/authApiSlice";
import Settings from "../../config/settings.json";

/**
 * JoinPage component handles users joining a campaign via invite link.
 * Allows users to accept campaign invitations and join the campaign.
 *
 * @returns {JSX.Element} The campaign join page
 */
function JoinPage() {
  // Navigation hook
  const navigate = useNavigate();

  // State variables
  const { campaign_id } = useParams();
  const [campaign, setCampaign] = useState({});
  const [error, setError] = useState("");

  // Get the new permissions after joining
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();

  // RTK query hooks
  const { data, isLoading, isSuccess } = useGetCampaignQuery(campaign_id);
  const [joinCampaign, { isLoading: joinLoad }] = useJoinCampaignMutation();

  /**
   * Handles joining the campaign.
   * Refreshes user credentials and navigates to the campaign page.
   */
  const joinCampaignHandler = async () => {
    try {
      await joinCampaign(campaign_id).unwrap();
      const refreshData = await refresh().unwrap();
      dispatch(setCredentials(refreshData));
      navigate(`/campaign/${campaign_id}`);
    } catch (error) {
      setError(error.data.error);
    }
  };

  // Update campaign data when it changes
  useEffect(() => {
    setCampaign(data);
  }, [data]);

  return (
    <>
      {!isLoading && !joinLoad ? (
        <>
          {/* Success state - show invitation */}
          {isSuccess ? (
            <div className="join_wrapper">
              <h1>
                You have been invited to join{" "}
                {campaign?.name ?? Settings.DEFAULTS.DEFAULT_CAMPAIGN_NAME}
              </h1>
              <Button
                variant="contained"
                color="error"
                onClick={() => joinCampaignHandler()}
              >
                Join Campaign
              </Button>
            </div>
          ) : (
            /* Error state */
            <div className="join_wrapper">
              <h1>Oops, an error occurred</h1>
              <h3>{error}</h3>
              <div>
                Try again, or ask an admin to re-invite you to the campaign
              </div>
            </div>
          )}
        </>
      ) : (
        /* Loading state */
        <div className="join_wrapper">Loading...</div>
      )}
    </>
  );
}

export default JoinPage;
