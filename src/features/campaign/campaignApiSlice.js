import { apiSlice } from "../../app/api/apiSlice";

export const campaignApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login query to get new set of tokens
    getCampaigns: builder.query({
      query: () => ({
        url: "/campaign",
        method: "GET",
        formData: true,
      }),
      providesTags: ["Campaigns"],
    }),

    // Handle creating a new campaign
    createCampaign: builder.mutation({
      query: (payload) => ({
        url: "/campaign",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Campaigns"],
    }),

    // Will handle leaving a campaign
    leaveCampaign: builder.mutation({
      query: (campaignId) => ({
        url: `campaign/leave/${campaignId}`,
        method: "POST",
      }),
      invalidatesTags: ["Campaigns"],
    }),

    //Will get an invite link
    getInviteLink: builder.mutation({
      query: (campaignId) => ({
        url: `/campaign/invite/${campaignId}/link`,
        method: "POST",
      }),
    }),

    //Will get an invite link
    sendInvite: builder.mutation({
      query: (inviteData) => ({
        url: `campaign/invite/${inviteData.campaignId}`,
        method: "POST",
        body: inviteData.formData,
        formData: true,
      }),
    }),

    // Handle creating a new campaign
    deleteCampaign: builder.mutation({
      query: (campaignId) => ({
        url: `/campaign/${campaignId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaigns"],
    }),

    // Will get Campaign Data for a particular Campaign
    getCampaign: builder.query({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: "GET",
      }),
      providesTags: ["Campaign"],
    }),

    // Will get the Campaigns main data
    getCampaignHomeData: builder.query({
      query: (id) => ({
        url: `${id}/pages/home`,
        method: "GET",
      }),
      providesTags: ["CampaignHome"],
    }),

    // Login query to get new set of tokens
    joinCampaign: builder.mutation({
      query: (campaignId) => ({
        url: `/campaign/join/${campaignId}`,
        method: "POST",
      }),
      invalidatesTags: ["Campaigns"],
    }),

    // Will update the campaign data and invalidate current state
    updateHomePage: builder.mutation({
      query: (homeData) => ({
        url: `${homeData.id}/pages/home`,
        method: "POST",
        body: homeData.formData,
        formData: true,
      }),
      invalidatesTags: ["CampaignHome"],
    }),

    // Handle getting the data for the users character
    getMyCharacterData: builder.query({
      query: (id) => ({
        url: `${id}/characters/mycharacter`,
        method: "GET",
      }),
      providesTags: ["MyCharacter"],
    }),

    // Will update the user's character data
    updateMyCharacter: builder.mutation({
      query: (charData) => ({
        url: `${charData.id}/characters/mycharacter`,
        method: "POST",
        body: charData.formData,
        formData: true,
      }),
      invalidatesTags: ["MyCharacter", "Party"],
    }),

    // Handle getting the data for the users character
    getPartyData: builder.query({
      query: (id) => ({
        url: `${id}/characters/party`,
        method: "GET",
      }),
      providesTags: ["Party"],
    }),

    // Handle Getting all npc data
    getNPCData: builder.query({
      query: (id) => ({
        url: `${id}/characters/npcs`,
        method: "GET",
      }),
      providesTags: ["NPC"],
    }),

    // Will update the user's character data
    createNewNPC: builder.mutation({
      query: (id) => ({
        url: `${id}/characters/npcs`,
        method: "POST",
      }),
      invalidatesTags: ["NPC"],
    }),

    // Will update the user's character data
    updateNPC: builder.mutation({
      query: (npcData) => ({
        url: `${npcData.campaignId}/characters/npc/${npcData.characterId}`,
        method: "POST",
        body: npcData.formData,
        formData: true,
      }),
      invalidatesTags: ["NPC"],
    }),

    // Will attempt to delete the NPC
    deleteNPC: builder.mutation({
      query: (npcData) => ({
        url: `${npcData.campaignId}/characters/npc/${npcData.characterId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NPC"],
    }),

    // Will attempt to get the world lore page
    getWorldLore: builder.query({
      query: (campaignId) => ({
        url: `${campaignId}/pages/world`,
        method: "GET",
      }),
      providesTags: ["WorldLore"],
    }),

    // Handle editing world lore
    updateWorldLore: builder.mutation({
      query: (worldData) => ({
        url: `${worldData.campaignId}/pages/world`,
        method: "POST",
        body: worldData.formData,
        formData: true,
      }),
      invalidatesTags: ["WorldLore"],
    }),

    // Get factions query
    getFactions: builder.query({
      query: (campaignId) => ({
        url: `${campaignId}/lore/faction`,
        method: "GET",
      }),
      providesTags: ["Factions"],
    }),

    // Handle editing factions data
    updateFaction: builder.mutation({
      query: (factionData) => ({
        url: `${factionData.campaignId}/lore/faction/${factionData.lore_id}`,
        method: "POST",
        body: factionData.formData,
        formData: true,
      }),
      invalidatesTags: ["Factions"],
    }),

    // Handle Create new faction
    createFaction: builder.mutation({
      query: (campaignId) => ({
        url: `${campaignId}/lore/faction`,
        method: "POST",
      }),
      invalidatesTags: ["Factions"],
    }),

    // Handle delete faction
    deleteFaction: builder.mutation({
      query: (factionData) => ({
        url: `${factionData.campaignId}/lore/faction/${factionData.lore_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Factions"],
    }),

    // Get locations query
    getLocation: builder.query({
      query: (campaignId) => ({
        url: `${campaignId}/lore/location`,
        method: "GET",
      }),
      providesTags: ["Locations"],
    }),

    // Handle editing location data
    updateLocation: builder.mutation({
      query: (locationData) => ({
        url: `${locationData.campaignId}/lore/location/${locationData.lore_id}`,
        method: "POST",
        body: locationData.formData,
        formData: true,
      }),
      invalidatesTags: ["Locations"],
    }),

    // Handle Create new Locations
    createLocation: builder.mutation({
      query: (campaignId) => ({
        url: `${campaignId}/lore/location`,
        method: "POST",
      }),
      invalidatesTags: ["Locations"],
    }),

    // Handle delete Location
    deleteLocation: builder.mutation({
      query: (LocationData) => ({
        url: `${LocationData.campaignId}/lore/location/${LocationData.lore_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Locations"],
    }),

    // Get locations query
    getThing: builder.query({
      query: (campaignId) => ({
        url: `${campaignId}/lore/thing`,
        method: "GET",
      }),
      providesTags: ["Things"],
    }),

    // Handle editing things data
    updateThing: builder.mutation({
      query: (thingData) => ({
        url: `${thingData.campaignId}/lore/thing/${thingData.lore_id}`,
        method: "POST",
        body: thingData.formData,
        formData: true,
      }),
      invalidatesTags: ["Things"],
    }),

    // Handle Create new thing
    createThing: builder.mutation({
      query: (campaignId) => ({
        url: `${campaignId}/lore/thing`,
        method: "POST",
      }),
      invalidatesTags: ["Things"],
    }),

    // Handle delete Thing
    deleteThing: builder.mutation({
      query: (thingData) => ({
        url: `${thingData.campaignId}/lore/thing/${thingData.lore_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Things"],
    }),

    // Lets get them session notes
    getSessions: builder.query({
      query: (campaignId) => ({
        url: `${campaignId}/notes/sessions`,
        method: "GET",
      }),
      providesTags: ["Sessions"],
    }),

    // will create a new session
    createSession: builder.mutation({
      query: (campaignId) => ({
        url: `${campaignId}/notes/sessions`,
        method: "POST",
      }),
      invalidatesTags: ["Sessions"],
    }),

    // Update a session
    updateSession: builder.mutation({
      query: (sessionData) => ({
        url: `${sessionData.campaignId}/notes/sessions/${sessionData.sessionId}`,
        method: "POST",
        body: sessionData.formData,
        formData: true,
      }),
      invalidatesTags: ["Sessions"],
    }),

    // Delete a session
    deleteSession: builder.mutation({
      query: (sessionData) => ({
        url: `${sessionData.campaignId}/notes/sessions/${sessionData.sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sessions"],
    }),

    // Kick Player
    kickPlayer: builder.mutation({
      query: (playerData) => ({
        url: `campaign/${playerData.campaignId}/players`,
        method: "DELETE",
        body: playerData.formData,
        formData: true,
      }),
      invalidatesTags: ["Campaign"],
    }),

    // Will get notes for a particular type of lore
    getTypeNotes: builder.query({
      query: ({ campaignId, noteType }) => {
        const baseUrl = `${campaignId}/notes/`;
        const queryParams = noteType ? `?note_type=${noteType}` : "";
        return {
          url: `${baseUrl}${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { noteType }) => [`${noteType}{Notes}`],
    }),

    // Will get notes for a particular type of lore
    createNote: builder.mutation({
      query: (noteData) => ({
        url: `${noteData.campaignId}/notes/${noteData.noteType}/${noteData.relatedId}`,
        method: "POST",
        body: noteData.formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { noteType }) => [`${noteType}{Notes}`],
    }),

    // Will delete a note
    deleteNote: builder.mutation({
      query: (noteData) => ({
        url: `${noteData.campaignId}/notes/${noteData.noteType}/${noteData.relatedId}/${noteData.noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { noteType }) => [`${noteType}{Notes}`],
    }),

    // Will update a note
    updateNote: builder.mutation({
      query: (noteData) => ({
        url: `${noteData.campaignId}/notes/${noteData.noteType}/${noteData.relatedId}/${noteData.noteId}`,
        method: "POST",
        body: noteData.formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { noteType }) => [`${noteType}{Notes}`],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useGetCampaignQuery,
  useGetInviteLinkMutation,
  useSendInviteMutation,
  useLeaveCampaignMutation,
  useDeleteCampaignMutation,
  useGetCampaignHomeDataQuery,
  useJoinCampaignMutation,
  useUpdateHomePageMutation,
  useGetMyCharacterDataQuery,
  useUpdateMyCharacterMutation,
  useGetPartyDataQuery,
  useGetNPCDataQuery,
  useCreateNewNPCMutation,
  useUpdateNPCMutation,
  useDeleteNPCMutation,
  useGetWorldLoreQuery,
  useUpdateWorldLoreMutation,
  useGetFactionsQuery,
  useUpdateFactionMutation,
  useCreateFactionMutation,
  useDeleteFactionMutation,
  useGetLocationQuery,
  useUpdateLocationMutation,
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useCreateThingMutation,
  useGetThingQuery,
  useUpdateThingMutation,
  useDeleteThingMutation,
  useGetSessionsQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useKickPlayerMutation,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetTypeNotesQuery,
  useUpdateNoteMutation,
} = campaignApiSlice;
