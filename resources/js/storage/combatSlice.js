import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "combat",
    initialState: { monsters: null, combat_data: null },
    reducers: {
        setMonsters: (state, { payload: { monsters } }) => {
            state.monsters = monsters;
        },
        setCombatData: (state, { payload: { combat_data } }) => {
            state.combat_data = combat_data;
        },
    },
});

export const { setMonsters, setCombatData } = slice.actions;

export const selectMonsters = (state) =>
    state ? (state.combat ? state.combat.monsters : null) : null;
export const selectCombatData = (state) =>
    state ? (state.combat ? state.combat.combat_data : null) : null;

export default slice.reducer;
