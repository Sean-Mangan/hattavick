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
        setPassword: builder.mutation({
            query: resetData => ({
                "url": "/auth/setPassword",
                method: "POST",
                body: resetData,
            })
        }),

        // reset password query
        resetPassword: builder.mutation({
            query: resetData => ({
                "url": "/auth/resetPassword",
                method: "POST",
                body: {email: resetData},
            })
        }),


        // Will send a verification request to validate the email
        validateEmail: builder.mutation({
            query: verificationId => ({
                "url": `/auth/verify/${verificationId}`,
                method: "POST",
            })
        })
    })
})

export const {
    useLoginMutation,
    useRefreshMutation,
    useRegisterMutation,
    useLogOutQueryMutation,
    useResetPasswordMutation,
    useValidateEmailMutation,
    useSetPasswordMutation
} = authApiSlice