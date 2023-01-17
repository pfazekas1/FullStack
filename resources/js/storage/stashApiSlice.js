import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = window.location.origin;

const stashApiSlice = createApi({
    reducerPath: "stashApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: (build) => ({
        getAll: build.mutation({
            query: () => {
                return {
                    url: "/api/stash",
                    method: "GET",
                };
            },
        }),
        getStore: build.mutation({
            query: () => {
                return {
                    url: "/api/store",
                    method: "GET",
                };
            },
        }),
        buyOne: build.mutation({
            query: (headers) => {
                return {
                    url: "/api/store",
                    method: "PATCH",
                    headers,
                };
            },
        }),
        sellOne: build.mutation({
            query: (headers) => {
                return {
                    url: "/api/stash",
                    method: "DELETE",
                    headers,
                };
            },
        }),
        equipOne: build.mutation({
            query: (headers) => {
                return {
                    url: "/api/stash",
                    method: "PATCH",
                    headers,
                };
            },
        }),
        respecAll: build.mutation({
            query: (headers) => {
                return {
                    url: "/api/sheet",
                    method: "PATCH",
                    headers,
                };
            },
        }),
        levelUpStat: build.mutation({
            query: (headers) => {
                return {
                    url: "/api/sheet",
                    method: "PUT",
                    headers,
                };
            },
        }),
    }),
});

export const {
    useGetAllMutation,
    useGetStoreMutation,
    useBuyOneMutation,
    useSellOneMutation,
    useEquipOneMutation,
    useRespecAllMutation,
    useLevelUpStatMutation,
} = stashApiSlice;

export default stashApiSlice;
