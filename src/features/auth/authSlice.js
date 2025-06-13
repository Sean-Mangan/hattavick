import { createSlice } from "@reduxjs/toolkit";

// Define the initial state and create the slice
const initialState = {
  email: null,
  token: null,
  permissions: {
    admin: [],
    owner: [],
    player: [],
  },
  user_id: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { email, accessToken, permissions, user_id } = action.payload;
      if (email) state.email = email;
      if (accessToken) state.token = accessToken;
      if (permissions) state.permissions = permissions;
      if (user_id) state.user_id = user_id;
    },
    logOut: (state, action) => {
      state.email = null;
      state.token = null;
      state.user_id = null;
      state.permissions = {
        admin: [],
        owner: [],
        player: [],
      };
    },
  },
});

// Export the reducer actions (will edit what is stored in state)
export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

// Export functions for getting certain attributes from state
export const selectCurrentUser = (state) => {
  return state.auth.user;
};
export const selectCurrentToken = (state) => {
  return state.auth.token;
};
export const selectCurrentPermissions = (state) => {
  return state.auth.permissions;
};
export const selectCurrentUserId = (state) => {
  return state.auth.user_id;
};
