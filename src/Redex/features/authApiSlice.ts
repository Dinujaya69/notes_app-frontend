import { apiSlice } from "@/Redex/apiSlice";
import { User } from "@/types";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   login: builder.mutation<
  { token: string; user: User },
  { email: string; password: string }
>({
  query: (credentials) => ({
    url: "/users/login",
    method: "POST",
    body: credentials,
  }),
    invalidatesTags: ["User"],

    }),
    register: builder.mutation<
      { token: string; user: User },
      Partial<User> & { password: string }
    >({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        body: userData,
      }),
        invalidatesTags: ["User"],
    }),
    getMe: builder.query<User, void>({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),
    
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
