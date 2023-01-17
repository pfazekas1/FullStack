import { configureStore } from "@reduxjs/toolkit";
import combatApiSlice from "./combatApiSlice";
import combatSlice from "./combatSlice";

import stashApiSlice from "./stashApiSlice";
import stashSlice from "./stashSlice";

export const store = configureStore({
    reducer: {
        stash: stashSlice,
        stashApi: stashApiSlice.reducer,
        combat: combatSlice,
        combatApi: combatApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(stashApiSlice.middleware)
            .concat(combatApiSlice.middleware),
});
