import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = window.location.origin;

const combatApiSlice = createApi({
    reducerPath: "combatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: (build) => ({
        getMonsters: build.mutation({
            query: () => {
                return {
                    url: "/api/combat",
                    method: "GET",
                };
            },
        }),
        getCombatData: build.mutation({
            query: (headers) => {
                return {
                    url: "/api/combat",
                    method: "PATCH",
                    headers,
                };
            },
        }),
    }),
});

export const { useGetMonstersMutation, useGetCombatDataMutation } =
    combatApiSlice;

export default combatApiSlice;
