import { selectCurrentUserId } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import {
  campaignApiSlice,
  useGetCampaignHomeDataQuery,
  useGetCampaignQuery,
  useGetCampaignsQuery,
  useGetFactionsQuery,
  useGetLocationQuery,
  useGetMyCharacterDataQuery,
  useGetNPCDataQuery,
  useGetPartyDataQuery,
  useGetSessionsQuery,
  useGetThingQuery,
  useGetWorldLoreQuery,
} from "../../features/campaign/campaignApiSlice";
import { useEffect, useState, createContext } from "react";
import LoadingScreen from "../Loading/LoadingScreen";

export const CampaignContext = createContext();

/**
 * ValidateCampaignUser component
 * Validates user access to campaign and loads all campaign data
 * Determines user role (admin/owner) and provides context to child routes
 */
const ValidateCampaignUser = () => {
  // Grab dat campaign id and other info
  const { campaignId } = useParams();

  // Reset the api on each reload
  campaignApiSlice.util.resetApiState();

  // Determine if the user is an admin
  const {
    data: campaigns,
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError,
  } = useGetCampaignsQuery();
  const userId = useSelector(selectCurrentUserId);
  const adminCampaigns = campaignsSuccess
    ? campaigns.admin.concat(campaigns.owner)
    : [];
  const isAdmin = adminCampaigns
    .map((campaign) => campaign?.id)
    .includes(campaignId);
  const isOwner = (campaignsSuccess ? campaigns.owner : [])
    .map((campaign) => campaign?.id)
    .includes(campaignId);

  // Get all them datas
  const {
    data: homepage,
    isLoading: homeLoading,
    isSuccess: homeSuccess,
    isError: homeError,
  } = useGetCampaignHomeDataQuery(campaignId, { skip: !campaignsSuccess });
  const {
    data: party,
    isLoading: partyLoading,
    isSuccess: partySuccess,
    isError: partyError,
  } = useGetPartyDataQuery(campaignId, { skip: !campaignsSuccess });
  const {
    data: npcs,
    isLoading: npcLoading,
    isSuccess: npcSuccess,
    isError: npcError,
  } = useGetNPCDataQuery(campaignId, { skip: !campaignsSuccess });
  const {
    data: world,
    isLoading: worldLoading,
    isSuccess: worldSuccess,
    isError: worldError,
  } = useGetWorldLoreQuery(campaignId, { skip: !campaignsSuccess });
  const {
    data: factions,
    isLoading: factionsLoading,
    isSuccess: factionsSuccess,
    isError: factionsError,
  } = useGetFactionsQuery(campaignId, { skip: !campaignsSuccess });
  const {
    data: locations,
    isLoading: locationsLoading,
    isSuccess: locationsSuccess,
    isError: locationsError,
  } = useGetLocationQuery(campaignId, { skip: !campaignsSuccess });
  const {
    data: things,
    isLoading: thingsLoading,
    isSuccess: thingsSuccess,
    isError: thingsError,
  } = useGetThingQuery(campaignId, { skip: !campaignsSuccess });
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isSuccess: sessionsSuccess,
    isError: sessionsError,
  } = useGetSessionsQuery(campaignId, { skip: !campaignsSuccess });
  const {
    data: myChar,
    isLoading: myCharLoading,
    isSuccess: myCharSuccess,
    isError: myCharError,
  } = useGetMyCharacterDataQuery(campaignId, {
    skip: !campaignsSuccess || isAdmin,
  });
  const {
    data: campaign,
    isLoading: campaignLoading,
    isSuccess: campaignSuccess,
    isError: campaignError,
  } = useGetCampaignQuery(campaignId, { skip: !campaignsSuccess || !isAdmin });

  /* Small helper function to ensure that the client has permission to view the given campaign */
  const [allCampaignIds, setAllCampaignIds] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Check to see if all the calls were successful
  const loadingList = [
    homeLoading,
    campaignsLoading,
    myCharLoading,
    partyLoading,
    npcLoading,
    worldLoading,
    factionsLoading,
    locationsLoading,
    thingsLoading,
    sessionsLoading,
    campaignLoading,
  ];

  // Get all campaign ids on any campaign change
  useEffect(() => {
    const adminCampaigns = campaigns?.admin ?? [];
    const ownerCampaigns = campaigns?.owner ?? [];
    const playerCampaigns = campaigns?.player ?? [];
    setAllCampaignIds(
      adminCampaigns
        .concat(ownerCampaigns, playerCampaigns)
        .map((campaign) => campaign?.id),
    );
  }, [campaigns]);

  // Make sure to set if the request is loading, or is errored
  useEffect(() => {
    if (!hasLoaded && loadingList.every((isLoading) => !isLoading))
      setHasLoaded(true);
  }, loadingList);

  // TODO: Add a better error page here
  // also add conditions for failure
  if (!hasLoaded) {
    return <LoadingScreen />;
  }

  if (!allCampaignIds.includes(campaignId)) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>You Do Not Have Permission to View This Campaign.</h1>
      </div>
    );
  }

  return <Outlet context={{ campaignId, isAdmin, isOwner, userId }} />;
};

export default ValidateCampaignUser;
