import { Outlet, useOutletContext } from "react-router-dom";
import {
  useCreateFactionMutation,
  useCreateLocationMutation,
  useCreateNewNPCMutation,
  useCreateSessionMutation,
  useCreateThingMutation,
  useDeleteCampaignMutation,
  useDeleteFactionMutation,
  useDeleteLocationMutation,
  useDeleteNPCMutation,
  useDeleteSessionMutation,
  useDeleteThingMutation,
  useGetCampaignHomeDataQuery,
  useGetCampaignQuery,
  useGetFactionsQuery,
  useGetInviteLinkMutation,
  useGetLocationQuery,
  useGetMyCharacterDataQuery,
  useGetNPCDataQuery,
  useGetPartyDataQuery,
  useGetSessionsQuery,
  useGetThingQuery,
  useGetWorldLoreQuery,
  useKickPlayerMutation,
  useLeaveCampaignMutation,
  useSendInviteMutation,
  useUpdateFactionMutation,
  useUpdateHomePageMutation,
  useUpdateLocationMutation,
  useUpdateMyCharacterMutation,
  useUpdateNPCMutation,
  useUpdateSessionMutation,
  useUpdateThingMutation,
  useUpdateWorldLoreMutation,
  useGetTypeNotesQuery,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
  useCreateNoteMutation,
} from "../../features/campaign/campaignApiSlice";
import { useEffect, useState } from "react";
import LoadingScreen from "../Loading/LoadingScreen";
import { Alert, AlertTitle } from "@mui/material";

/**
 * CampaignErrorLoadingWindow component
 * Manages loading states and errors for all campaign-related queries and mutations
 * Displays loading screen and error alerts as needed
 */
const CampaignErrorLoadingWindow = () => {
  // get the campaign id and if the user is an admin
  const { campaignId, isAdmin } = useOutletContext();

  const {
    data,
    isFetching: homeFetching,
    error: homeError,
  } = useGetCampaignHomeDataQuery(campaignId);
  const { isFetching: partyFetching, error: partyError } =
    useGetPartyDataQuery(campaignId);
  const { isFetching: npcFetching, error: npcError } =
    useGetNPCDataQuery(campaignId);
  const { isFetching: worldFetching, error: worldError } =
    useGetWorldLoreQuery(campaignId);
  const { isFetching: factionsFetching, error: factionsError } =
    useGetFactionsQuery(campaignId);
  const { isFetching: locationsFetching, error: locationsError } =
    useGetLocationQuery(campaignId);
  const { isFetching: thingsFetching, error: thingsError } =
    useGetThingQuery(campaignId);
  const { isFetching: sessionFetching, error: sessionsError } =
    useGetSessionsQuery(campaignId);
  const { isFetching: myCharFetching, error: myCharError } =
    useGetMyCharacterDataQuery(campaignId, { skip: isAdmin });
  const { isFetching: campaignFetching, error: campaignError } =
    useGetCampaignQuery(campaignId, { skip: !isAdmin });
  const { isFetching: npcNotesFetching, error: npcNotesError } =
    useGetTypeNotesQuery({ campaignId, noteType: "npcs" });
  const { isFetching: locationNotesFetching, error: locationNotesError } =
    useGetTypeNotesQuery({ campaignId, noteType: "locations" });
  const { isFetching: thingNotesFetching, error: thingNotesError } =
    useGetTypeNotesQuery({ campaignId, noteType: "things" });
  const { isFetching: factionNotesFetching, error: factionNotesError } =
    useGetTypeNotesQuery({ campaignId, noteType: "factions" });
  const { isFetching: worldNotesFetching, error: worldNotesError } =
    useGetTypeNotesQuery({ campaignId, noteType: "world_page" });
  const { isFetching: homeNotesFetching, error: homeNotesError } =
    useGetTypeNotesQuery({ campaignId, noteType: "home_page" });
  const { isFetching: characterNotesFetching, error: characterNotesError } =
    useGetTypeNotesQuery({ campaignId, noteType: "characters" });

  // Also get the Mutations loading status
  const [
    ,
    {
      isLoading: updateHomeLoading,
      error: updateHomeError,
      reset: updateHomeReset,
    },
  ] = useUpdateHomePageMutation({ fixedCacheKey: "update-home" });
  const [
    ,
    {
      isLoading: createNPCLoading,
      error: createNPCError,
      reset: createNPCReset,
    },
  ] = useCreateNewNPCMutation({ fixedCacheKey: "create-npc" });
  const [
    ,
    {
      isLoading: updateNPCLoading,
      error: updateNPCError,
      reset: updateNPCReset,
    },
  ] = useUpdateNPCMutation({ fixedCacheKey: "update-npc" });
  const [
    ,
    {
      isLoading: deleteNPCLoading,
      error: deleteNPCError,
      reset: deleteNPCReset,
    },
  ] = useDeleteNPCMutation({ fixedCacheKey: "delete-npc" });
  const [
    ,
    {
      isLoading: updateMyCharLoading,
      error: updateMyCharError,
      reset: updateMyCharReset,
    },
  ] = useUpdateMyCharacterMutation({ fixedCacheKey: "update-my-char" });
  const [
    ,
    {
      isLoading: updateWorldLoreLoading,
      error: updateWorldLoreError,
      reset: updateWorldReset,
    },
  ] = useUpdateWorldLoreMutation({ fixedCacheKey: "update-world-lore" });
  const [
    ,
    {
      isLoading: updateFactionLoading,
      error: updateFactionError,
      reset: updateFactionReset,
    },
  ] = useUpdateFactionMutation({ fixedCacheKey: "update-faction" });
  const [
    ,
    {
      isLoading: createFactionLoading,
      error: createFactionError,
      reset: createFactionReset,
    },
  ] = useCreateFactionMutation({ fixedCacheKey: "create-faction" });
  const [
    ,
    {
      isLoading: deleteFactionLoading,
      error: deleteFactionError,
      reset: deleteFactionReset,
    },
  ] = useDeleteFactionMutation({ fixedCacheKey: "delete-faction" });
  const [
    ,
    {
      isLoading: updateLocationLoading,
      error: updateLocationError,
      reset: updateLocationReset,
    },
  ] = useUpdateLocationMutation({ fixedCacheKey: "update-location" });
  const [
    ,
    {
      isLoading: createLocationLoading,
      error: createLocationError,
      reset: createLocationReset,
    },
  ] = useCreateLocationMutation({ fixedCacheKey: "create-location" });
  const [
    ,
    {
      isLoading: deleteLocationLoading,
      error: deleteLocationError,
      reset: deleteLocationReset,
    },
  ] = useDeleteLocationMutation({ fixedCacheKey: "delete-location" });
  const [
    ,
    {
      isLoading: updateThingLoading,
      error: updateThingError,
      reset: updateThingReset,
    },
  ] = useUpdateThingMutation({ fixedCacheKey: "update-thing" });
  const [
    ,
    {
      isLoading: createThingLoading,
      error: createThingError,
      reset: createThingReset,
    },
  ] = useCreateThingMutation({ fixedCacheKey: "create-thing" });
  const [
    ,
    {
      isLoading: deleteThingLoading,
      error: deleteThingError,
      reset: deleteThingReset,
    },
  ] = useDeleteThingMutation({ fixedCacheKey: "delete-thing" });
  const [
    ,
    {
      isLoading: createSessionLoading,
      error: createSessionError,
      reset: createSessionReset,
    },
  ] = useCreateSessionMutation({ fixedCacheKey: "create-session" });
  const [
    ,
    {
      isLoading: updateSessionLoading,
      error: updateSessionError,
      reset: updateSessionReset,
    },
  ] = useUpdateSessionMutation({ fixedCacheKey: "update-session" });
  const [
    ,
    {
      isLoading: deleteSessionLoading,
      error: deleteSessionError,
      reset: deleteSessionReset,
    },
  ] = useDeleteSessionMutation({ fixedCacheKey: "delete-session" });
  const [
    ,
    {
      isLoading: deleteCampaignLoading,
      error: deleteCampaignError,
      reset: deleteCampaignReset,
    },
  ] = useDeleteCampaignMutation({ fixedCacheKey: "delete-campaign" });
  const [
    ,
    {
      isLoading: getInviteLoading,
      error: getInviteError,
      reset: getInviteReset,
    },
  ] = useGetInviteLinkMutation({ fixedCacheKey: "get-invite" });
  const [
    ,
    {
      isLoading: leaveCampaignLoading,
      error: leaveCampaignError,
      reset: leaveCampaignReset,
    },
  ] = useLeaveCampaignMutation({ fixedCacheKey: "leave-campaign" });
  const [
    ,
    {
      isLoading: sendInviteLoading,
      error: sendInviteError,
      reset: sendInviteReset,
    },
  ] = useSendInviteMutation({ fixedCacheKey: "send-invite" });
  const [
    ,
    {
      isLoading: kickPayerLoading,
      error: kickPayerError,
      reset: kickPayerReset,
    },
  ] = useKickPlayerMutation({ fixedCacheKey: "kick-player" });

  // Note related hooks
  const [
    ,
    {
      isLoading: updateLocationNotesLoading,
      error: updateLocationNotesError,
      reset: updateLocationNotesReset,
    },
  ] = useUpdateNoteMutation({ fixedCacheKey: "update-locations-note" });
  const [
    ,
    {
      isLoading: updateThingNotesLoading,
      error: updateThingNotesError,
      reset: updateThingNotesReset,
    },
  ] = useUpdateNoteMutation({ fixedCache: "update-things-note" });
  const [
    ,
    {
      isLoading: updateFactionNotesLoading,
      error: updateFactionNotesError,
      reset: updateFactionNotesReset,
    },
  ] = useUpdateNoteMutation({ fixedCacheKey: "update-factions-note" });
  const [
    ,
    {
      isLoading: updateWorldNotesLoading,
      error: updateWorldNotesError,
      reset: updateWorldNotesReset,
    },
  ] = useUpdateNoteMutation({ fixedCache: "update-world_page-note" });
  const [
    ,
    {
      isLoading: updateHomeNotesLoading,
      error: updateHomeNotesError,
      reset: updateHomeNotesReset,
    },
  ] = useUpdateNoteMutation({ fixedCacheKey: "update-home_page-note" });
  const [
    ,
    {
      isLoading: updateCharacterNotesLoading,
      error: updateCharacterNotesError,
      reset: updateCharacterNotesReset,
    },
  ] = useUpdateNoteMutation({ fixedCacheKey: "update-characters-note" });
  const [
    ,
    {
      isLoading: updateNPCNotesLoading,
      error: updateNPCNotesError,
      reset: updateNPCNotesReset,
    },
  ] = useUpdateNoteMutation({ fixedCacheKey: "update-npc-note" });
  const [
    ,
    {
      isLoading: createLocationNotesLoading,
      error: createLocationNotesError,
      reset: createLocationNotesReset,
    },
  ] = useCreateNoteMutation({ fixedCacheKey: "create-locations-note" });
  const [
    ,
    {
      isLoading: createThingNotesLoading,
      error: createThingNotesError,
      reset: createThingNotesReset,
    },
  ] = useCreateNoteMutation({ fixedCacheKey: "create-things-note" });
  const [
    ,
    {
      isLoading: createFactionNotesLoading,
      error: createFactionNotesError,
      reset: createFactionNotesReset,
    },
  ] = useCreateNoteMutation({ fixedCacheKey: "create-factions-note" });
  const [
    ,
    {
      isLoading: createWorldNotesLoading,
      error: createWorldNotesError,
      reset: createWorldNotesReset,
    },
  ] = useCreateNoteMutation({ fixedCacheKey: "create-world_page-note" });
  const [
    ,
    {
      isLoading: createHomeNotesLoading,
      error: createHomeNotesError,
      reset: createHomeNotesReset,
    },
  ] = useCreateNoteMutation({ fixedCacheKey: "create-home_page-note" });
  const [
    ,
    {
      isLoading: createCharacterNotesLoading,
      error: createCharacterNotesError,
      reset: createCharacterNotesReset,
    },
  ] = useCreateNoteMutation({ fixedCacheKey: "create-characters-note" });
  const [
    ,
    {
      isLoading: createNPCNotesLoading,
      error: createNPCNotesError,
      reset: createNPCNotesReset,
    },
  ] = useCreateNoteMutation({ fixedCacheKey: "create-npcs-note" });
  const [
    ,
    {
      isLoading: deleteLocationNotesLoading,
      error: deleteLocationNotesError,
      reset: deleteLocationNotesReset,
    },
  ] = useDeleteNoteMutation({ fixedCacheKey: "delete-locations-note" });
  const [
    ,
    {
      isLoading: deleteThingNotesLoading,
      error: deleteThingNotesError,
      reset: deleteThingNotesReset,
    },
  ] = useDeleteNoteMutation({ fixedCacheKey: "delete-things-note" });
  const [
    ,
    {
      isLoading: deleteFactionNotesLoading,
      error: deleteFactionNotesError,
      reset: deleteFactionNotesReset,
    },
  ] = useDeleteNoteMutation({ fixedCacheKey: "delete-factions-note" });
  const [
    ,
    {
      isLoading: deleteWorldNotesLoading,
      error: deleteWorldNotesError,
      reset: deleteWorldNotesReset,
    },
  ] = useDeleteNoteMutation({ fixedCacheKey: "delete-world_page-note" });
  const [
    ,
    {
      isLoading: deleteHomeNotesLoading,
      error: deleteHomeNotesError,
      reset: deleteHomeNotesReset,
    },
  ] = useDeleteNoteMutation({ fixedCacheKey: "delete-home_page-note" });
  const [
    ,
    {
      isLoading: deleteCharacterNotesLoading,
      error: deleteCharacterNotesError,
      reset: deleteCharacterNotesReset,
    },
  ] = useDeleteNoteMutation({ fixedCacheKey: "delete-characters-note" });
  const [
    ,
    {
      isLoading: deleteNPCNotesLoading,
      error: deleteNPCNotesError,
      reset: deleteNPCNotesReset,
    },
  ] = useDeleteNoteMutation({ fixedCacheKey: "delete-npcs-note" });

  // Create some arrays for fetching data
  const fetchingArr = [
    npcNotesFetching,
    locationNotesFetching,
    thingNotesFetching,
    factionNotesFetching,
    worldNotesFetching,
    homeNotesFetching,
    characterNotesFetching,
    homeFetching,
    partyFetching,
    npcFetching,
    worldFetching,
    factionsFetching,
    locationsFetching,
    thingsFetching,
    sessionFetching,
    myCharFetching,
    updateHomeLoading,
    createNPCLoading,
    updateNPCLoading,
    updateMyCharLoading,
    updateWorldLoreLoading,
    deleteNPCLoading,
    updateFactionLoading,
    createFactionLoading,
    deleteFactionLoading,
    updateLocationLoading,
    createLocationLoading,
    deleteLocationLoading,
    updateThingLoading,
    createThingLoading,
    deleteThingLoading,
    createSessionLoading,
    updateSessionLoading,
    deleteSessionLoading,
    deleteCampaignLoading,
    sendInviteLoading,
    getInviteLoading,
    leaveCampaignLoading,
    campaignFetching,
    kickPayerLoading,
    updateLocationNotesLoading,
    updateThingNotesLoading,
    updateFactionNotesLoading,
    updateWorldNotesLoading,
    updateHomeNotesLoading,
    updateCharacterNotesLoading,
    updateNPCNotesLoading,
    createLocationNotesLoading,
    createThingNotesLoading,
    createFactionNotesLoading,
    createWorldNotesLoading,
    createHomeNotesLoading,
    createCharacterNotesLoading,
    createNPCNotesLoading,
    deleteLocationNotesLoading,
    deleteThingNotesLoading,
    deleteFactionNotesLoading,
    deleteWorldNotesLoading,
    deleteHomeNotesLoading,
    deleteCharacterNotesLoading,
    deleteNPCNotesLoading,
  ];

  // Create some arrays for errors
  const errorArr = [
    homeError,
    partyError,
    npcError,
    worldError,
    factionsError,
    locationsError,
    thingsError,
    sessionsError,
    myCharError,
    updateHomeError,
    createNPCError,
    deleteNPCError,
    updateMyCharError,
    updateWorldLoreError,
    updateNPCError,
    updateFactionError,
    createFactionError,
    deleteFactionError,
    updateLocationError,
    createLocationError,
    deleteLocationError,
    updateThingError,
    createThingError,
    deleteThingError,
    updateSessionError,
    createSessionError,
    deleteSessionError,
    deleteCampaignError,
    getInviteError,
    sendInviteError,
    leaveCampaignError,
    campaignError,
    kickPayerError,
    updateLocationNotesError,
    updateThingNotesError,
    updateFactionNotesError,
    updateWorldNotesError,
    updateHomeNotesError,
    updateCharacterNotesError,
    updateNPCNotesError,
    createLocationNotesError,
    createThingNotesError,
    createFactionNotesError,
    createWorldNotesError,
    createHomeNotesError,
    createCharacterNotesError,
    createNPCNotesError,
    deleteLocationNotesError,
    deleteThingNotesError,
    deleteFactionNotesError,
    deleteWorldNotesError,
    deleteHomeNotesError,
    deleteCharacterNotesError,
    deleteNPCNotesError,
    npcNotesError,
    locationNotesError,
    thingNotesError,
    factionNotesError,
    worldNotesError,
    homeNotesError,
    characterNotesError,
  ];

  // helpful arr for reseting all mutations
  const resetArr = [
    updateHomeReset,
    createNPCReset,
    deleteNPCReset,
    updateMyCharReset,
    updateWorldReset,
    updateNPCReset,
    updateFactionReset,
    createFactionReset,
    deleteFactionReset,
    updateLocationReset,
    createLocationReset,
    deleteLocationReset,
    updateThingReset,
    createThingReset,
    deleteThingReset,
    updateSessionReset,
    createSessionReset,
    deleteSessionReset,
    deleteCampaignReset,
    getInviteReset,
    sendInviteReset,
    leaveCampaignReset,
    kickPayerReset,
    updateLocationNotesReset,
    updateThingNotesReset,
    updateFactionNotesReset,
    updateWorldNotesReset,
    updateHomeNotesReset,
    updateCharacterNotesReset,
    updateNPCNotesReset,
    createLocationNotesReset,
    createThingNotesReset,
    createFactionNotesReset,
    createWorldNotesReset,
    createHomeNotesReset,
    createCharacterNotesReset,
    createNPCNotesReset,
    deleteLocationNotesReset,
    deleteThingNotesReset,
    deleteFactionNotesReset,
    deleteWorldNotesReset,
    deleteHomeNotesReset,
    deleteCharacterNotesReset,
    deleteNPCNotesReset,
  ];

  /* Small helper function to ensure that the client has permission to view the given campaign */
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  /**
   * Reset all error states
   * Calls reset on all mutation hooks and clears the error message
   */
  const resetError = () => {
    resetArr.forEach((reset) => reset());
    setError("");
  };

  // If any event is loading, set the loading screen
  useEffect(() => {
    setIsFetching(fetchingArr.some((bool) => bool));
  }, fetchingArr);

  // If any event has failed, raise the error
  useEffect(() => {
    const error = errorArr.find((elem) => elem !== null);
    if (error) setError(error?.data?.error ?? "An unknown error occurred");
  }, errorArr);

  return (
    <>
      {isFetching && <LoadingScreen background="transparent" />}
      {error && (
        <Alert
          className="campaign_create_err"
          onClose={resetError}
          style={error !== "" ? { textAlign: "left" } : { display: "none" }}
          severity="error"
        >
          <AlertTitle>Error</AlertTitle>
          <strong>Oops, an error occurred</strong> — {error}
        </Alert>
      )}
      <Outlet context={{ ...useOutletContext(), error, resetError }} />
    </>
  );
};

export default CampaignErrorLoadingWindow;
