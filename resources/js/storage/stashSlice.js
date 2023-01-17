import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "stash",
    initialState: { total: 0, limit: null, skip: null, data: null },
    reducers: {
        setAll: (state, { payload: { total, limit, skip, data } }) => {
            state.total = total;
            state.limit = limit;
            state.skip = skip;
            state.data = data;
        },
        setSkip: (state, { payload: { skip } }) => {
            state.skip = skip;
        },
        setEquipedIds: (state, { payload: { equipedIds } }) => {
            console.log(equipedIds);
            let tempData = state.data;
            tempData.equipedIds = equipedIds;
            state.data = tempData;
            console.log(state);
        },
    },
});

export const { setAll, setSkip, setEquipedIds } = slice.actions;

export const selectCurrentData = (state) =>
    state ? (state.stash ? state.stash.data : null) : null;
export const selectCurrentSkip = (state) =>
    state ? (state.stash ? state.stash.skip : null) : null;
export const selectCurrentTotal = (state) =>
    state ? (state.stash ? state.stash.total : null) : null;

export default slice.reducer;
