import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice'

// Depending on the ENV, set the url to point to a local server or the remote
//const BASE_URL = "https://api.hattavick.com"
const BASE_URL = "http://127.0.0.1:5001"

// Define a base query for all requests
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    tagTypes: ['Campaigns', 'Campaign', "CampaignHome", "MyCharacter", "Party", "NPC", "WorldLore", "Factions", "Sessions", "Locations", "Things", "Players"],

    // If auth heders are stored in state, include the Auth header
    prepareHeaders: (headers, {getState}) => {
        const token= getState().auth.token
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) =>{

    // Attempt the base request
    let result = await baseQuery(args, api, extraOptions)

    // On a 403, attempt to refresh the access token and make the request again
    if (result?.error?.status === 403) {
        const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)


        // After refresh, attempt query again
        if (refreshResult?.data) {
            const user = api.getState().auth.user
            api.dispatch(setCredentials({...refreshResult.data, user}))
            result = await baseQuery(args, api, extraOptions)
        } 
        else {
            api.dispatch(logOut())
        }
    }
    return result
}       

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})