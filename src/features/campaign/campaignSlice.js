import { createSlice } from "@reduxjs/toolkit";


// Define the initial state and create the slice
const initialState = {
    isLoading: false,
    error : "",
}

const campaignSlice = createSlice({
    name: 'campaign',
    initialState: initialState,
    reducers: {
        setIsLoading: (state, action) => {
            const {isLoading} = action.payload
            state.isLoading = isLoading
        },
        setError: (state, action) => {
            const {error} = action.payload
            state.error = error
        }
    }
})

// Export the reducer actions (will edit what is stored in state)
export const {
    setIsLoading,
    setError
} = campaignSlice.actions
export default campaignSlice.reducer

// Export functions for getting certain attributes from state
export const selectisLoading = (state) => {return state.campaign.isLoading}
export const selectError= (state) => {return state.campaign.error}
