import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        // Login query to get new set of tokens
        login: builder.mutation({
            query: userData  => ({
                "url": "/auth/login",
                method: "POST",
                body: {
                    "email": userData.email,
                    "password": userData.password
                }
            }),
            invalidatesTags: ["Campaigns"]
        }),

        // Refresh query to be used on page loads
        refresh: builder.mutation({
            query: () => ({
                "url": "/auth/refresh",
                method: "GET",
            }),
            invalidatesTags: ["Campaigns"]
        }),

        // Registration query
        register: builder.mutation({
            query: userData => ({
                "url": "/auth/register",
                method: "POST",
                body: {
                    "email": userData.email,
                    "password": userData.password
                }
            }),
            invalidatesTags: ["Campaigns"]
        }),

        // Logout query
        logOutQuery: builder.mutation({
            query: () => ({
                "url": "/auth/logout",
                method: "GET",
            }),
            invalidatesTags: ["Campaigns"]
        }),

        // reset password query
        resetPassword: builder.mutation({
            query: resetData => ({
                "url": "/auth/setPassword",
                method: "POST",
                body: resetData,
                formData: true
            })
        })
    })
})

export const {
    useLoginMutation,
    useRefreshMutation,
    useRegisterMutation,
    useLogOutQueryMutation,
    useResetPasswordMutation
} = authApiSlice