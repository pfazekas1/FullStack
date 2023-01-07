import { configureStore } from "@reduxjs/toolkit";


import stashApiSlice from "./stashApiSlice";
import stashSlice from "./stashSlice";

export const store = configureStore({
    reducer: {
        stash: stashSlice,
        stashApi: stashApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(stashApiSlice.middleware),
});
