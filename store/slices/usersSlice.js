import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
	name: "counter",
	initialState: {
		list: [],
		ready: false,
	},
	reducers: {
		update: (state, action) => {
			if (action.payload && action.payload.length > 0) {
				state.list = action.payload;
				state.ready = true;
			} else {
				state.list = [];
				state.success = false;
			}
		},
	},
});

// Action creators are generated for each case reducer function
export const { update } = usersSlice.actions;

export default usersSlice.reducer;
