import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = window.location.origin;

const stashApiSlice = createApi({
    reducerPath: "stashApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: (build) => ({
        getAll: build.mutation({
            query: (skip) => {
                return {
                    url: "/api/stash",
                    method: "GET",
                };
            },
        }),
    }),
});

export const { useGetAllMutation } = stashApiSlice;

export default stashApiSlice;
