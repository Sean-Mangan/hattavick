import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";
import Settings from "../../config/settings";

// Depending on the ENV, set the url to point to a local server or the remote
const BASE_URL = "https://api.hattavick.com";
//const BASE_URL = "http://127.0.0.1:5001"

// Store failed requests in localStorage
const FAILED_REQUESTS_KEY = "failedApiRequests";

function saveFailedRequest(args) {
  try {
    const existing =
      JSON.parse(localStorage.getItem(FAILED_REQUESTS_KEY)) || [];
    existing.push(args);
    localStorage.setItem(FAILED_REQUESTS_KEY, JSON.stringify(existing));
  } catch (e) {
    // fallback: do nothing
  }
}

export function replayFailedRequests(api) {
  try {
    const failed = JSON.parse(localStorage.getItem(FAILED_REQUESTS_KEY)) || [];
    failed.forEach((args) => {
      // Only replay mutations (POST, PATCH, DELETE)
      if (
        args &&
        args.method &&
        ["POST", "PATCH", "DELETE"].includes(args.method)
      ) {
        baseQuery(args, api, {});
      }
    });
    localStorage.removeItem(FAILED_REQUESTS_KEY);
  } catch (e) {
    // fallback: do nothing
  }
}

// Define a base query for all requests
const baseQuery = fetchBaseQuery({
  baseUrl: Settings.API_ENDPOINT,
  credentials: "include",
  tagTypes: [
    "Campaigns",
    "Campaign",
    "CampaignHome",
    "MyCharacter",
    "Party",
    "NPC",
    "WorldLore",
    "Factions",
    "Sessions",
    "Locations",
    "Things",
    "Players",
  ],

  // If auth heders are stored in state, include the Auth header
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Attempt the base request
  let result = await baseQuery(args, api, extraOptions);

  // On a 403, attempt to refresh the access token and make the request again
  if (result?.error?.status === 403) {
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    // After refresh, attempt query again
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Save failed mutation requests for replay after login
      if (
        typeof args === "object" &&
        args.method &&
        ["POST", "PATCH", "DELETE"].includes(args.method)
      ) {
        saveFailedRequest(args);
      }
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
