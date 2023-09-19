import { Outlet, useOutletContext} from "react-router-dom";
import {useCreateFactionMutation, useCreateLocationMutation, useCreateNewNPCMutation, useCreateSessionMutation, useCreateThingMutation, useDeleteCampaignMutation, useDeleteFactionMutation, useDeleteLocationMutation, useDeleteNPCMutation, useDeleteSessionMutation, useDeleteThingMutation, useGetCampaignHomeDataQuery, useGetCampaignQuery, useGetFactionsQuery, useGetInviteLinkMutation, useGetLocationQuery, useGetMyCharacterDataQuery, useGetNPCDataQuery, useGetPartyDataQuery, useGetSessionsQuery, useGetThingQuery, useGetWorldLoreQuery, useKickPlayerMutation, useLeaveCampaignMutation, useSendInviteMutation, useUpdateFactionMutation, useUpdateHomePageMutation, useUpdateLocationMutation, useUpdateMyCharacterMutation, useUpdateNPCMutation, useUpdateSessionMutation, useUpdateThingMutation, useUpdateWorldLoreMutation } from "../../features/campaign/campaignApiSlice";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../Loading/LoadingScreen";
import { Alert, AlertTitle } from "@mui/material";

const CampaignErrorLoadingWindow = () => {

    // get the campaign id and if the user is an admin
    const {campaignId, isAdmin} = useOutletContext()

    const {data, isFetching: homeFetching, error: homeError} = useGetCampaignHomeDataQuery(campaignId)
    const {isFetching: partyFetching, error: partyError} = useGetPartyDataQuery(campaignId)
    const {isFetching: npcFetching, error: npcError} = useGetNPCDataQuery(campaignId)
    const {isFetching: worldFetching, error: worldError} = useGetWorldLoreQuery(campaignId)
    const {isFetching: factionsFetching, error: factionsError} = useGetFactionsQuery(campaignId)
    const {isFetching: locationsFetching, error: locationsError} = useGetLocationQuery(campaignId)
    const {isFetching: thingsFetching, error: thingsError} = useGetThingQuery(campaignId)
    const {isFetching: sessionFetching, error: sessionsError} = useGetSessionsQuery(campaignId)
    const {isFetching: myCharFetching, error: myCharError} = useGetMyCharacterDataQuery(campaignId, {skip: isAdmin})
    const {isFetching: campaignFetching, error: campaignError} = useGetCampaignQuery(campaignId, {skip: !isAdmin})

    // Also get the Mutations loading status
    const [, {isLoading: updateHomeLoading, error: updateHomeError, reset: updateHomeReset}] = useUpdateHomePageMutation({fixedCacheKey: 'update-home'})
    const [, {isLoading: createNPCLoading, error: createNPCError, reset: createNPCReset}] = useCreateNewNPCMutation({fixedCacheKey: 'create-npc'})
    const [, {isLoading: updateNPCLoading, error: updateNPCError, reset: updateNPCReset}] = useUpdateNPCMutation({fixedCacheKey: 'update-npc'})
    const [, {isLoading: deleteNPCLoading, error: deleteNPCError, reset: deleteNPCReset}] = useDeleteNPCMutation({fixedCacheKey: 'delete-npc'})
    const [, {isLoading: updateMyCharLoading, error: updateMyCharError, reset: updateMyCharReset}] = useUpdateMyCharacterMutation({fixedCacheKey: 'update-my-char'})
    const [, {isLoading: updateWorldLoreLoading, error: updateWorldLoreError, reset: updateWorldReset}] = useUpdateWorldLoreMutation({fixedCacheKey: 'update-world-lore'})
    const [, {isLoading: updateFactionLoading, error: updateFactionError, reset: updateFactionReset}] = useUpdateFactionMutation({fixedCacheKey: 'update-faction'})
    const [, {isLoading: createFactionLoading, error: createFactionError, reset: createFactionReset}] = useCreateFactionMutation({fixedCacheKey: 'create-faction'})
    const [, {isLoading: deleteFactionLoading, error: deleteFactionError, reset: deleteFactionReset}] = useDeleteFactionMutation({fixedCacheKey: 'delete-faction'})
    const [, {isLoading: updateLocationLoading, error: updateLocationError, reset: updateLocationReset}] = useUpdateLocationMutation({fixedCacheKey: 'update-location'})
    const [, {isLoading: createLocationLoading, error: createLocationError, reset: createLocationReset}] = useCreateLocationMutation({fixedCacheKey: 'create-location'})
    const [, {isLoading: deleteLocationLoading, error: deleteLocationError, reset: deleteLocationReset}] = useDeleteLocationMutation({fixedCacheKey: 'delete-location'})
    const [, {isLoading: updateThingLoading, error: updateThingError, reset: updateThingReset}] = useUpdateThingMutation({fixedCacheKey: 'update-thing'})
    const [, {isLoading: createThingLoading, error: createThingError, reset: createThingReset}] = useCreateThingMutation({fixedCacheKey: 'create-thing'})
    const [, {isLoading: deleteThingLoading, error: deleteThingError, reset: deleteThingReset}] = useDeleteThingMutation({fixedCacheKey: 'delete-thing'})
    const [, {isLoading: createSessionLoading, error: createSessionError, reset: createSessionReset}] = useCreateSessionMutation({fixedCacheKey: 'create-session'})
    const [, {isLoading: updateSessionLoading, error: updateSessionError, reset: updateSessionReset}] = useUpdateSessionMutation({fixedCacheKey: 'update-session'})
    const [, {isLoading: deleteSessionLoading, error: deleteSessionError, reset: deleteSessionReset}] = useDeleteSessionMutation ({fixedCacheKey: 'delete-session'})
    const [, {isLoading: deleteCampaignLoading, error: deleteCampaignError, reset: deleteCampaignReset}] = useDeleteCampaignMutation({fixedCacheKey: 'delete-campaign'})
    const [, {isLoading: getInviteLoading, error: getInviteError, reset: getInviteReset}] = useGetInviteLinkMutation({fixedCacheKey: 'get-invite'})
    const [, {isLoading: leaveCampaignLoading, error: leaveCampaignError, reset: leaveCampaignReset}] = useLeaveCampaignMutation({fixedCacheKey: 'leave-campaign'})
    const [, {isLoading: sendInviteLoading, error: sendInviteError, reset: sendInviteReset}] = useSendInviteMutation({fixedCacheKey: 'send-invite'})
    const [, {isLoading: kickPayerLoading, error: kickPayerError, reset: kickPayerReset}] = useKickPlayerMutation({fixedCacheKey: 'kick-player'})


    // Create some arrays for Fetching data
    var fetchingArr = [
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
        kickPayerLoading
    ]

    // Create some arrays for errors
    const errArr = [
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
        kickPayerError
    ]

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
        kickPayerReset
    ]

    /* Small helper function to ensure that the client has permission to view the given campaign */
    const [error, setError] = useState("")
    const [isFetching, setIsFetching] = useState(false)

    // Helpful function to reset whatever error occured
    const resetError = () => {
        resetArr.map((reset) => reset())
        setError("")
    }

    // If any event is loading, set the loading screen
    useEffect(()=> {
        setIsFetching(fetchingArr.some((bool)=> bool))
    }, fetchingArr)

     // If any event has failed, raise the error
    useEffect(()=> {
        const err = errArr.find((elem)=> elem != null)
        if (err) setError(err?.data?.error ?? "An unkown error occured")
    }, errArr)

    return (
        <> 
            {(isFetching) ? <LoadingScreen background={"transparent"}/> : <></>}
            {(error) 
                ? 
                    <Alert 
                    className='campaign_create_err'
                    onClose={() => {resetError()}} style={(error !== "") ? {textAlign:"left"} : {display: "none"}} 
                    severity="error"
                    >
                        <AlertTitle>Error</AlertTitle>
                        <strong>Oops, an error occured</strong> — {error}
                    </Alert> 
                : <></>
            }
            <Outlet context={{...useOutletContext(), error, resetError}}/>
        </>
    )
}

export default CampaignErrorLoadingWindow