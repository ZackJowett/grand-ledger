import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import usersReducer from "./slices/usersSlice";

export default configureStore({
	reducer: {
		counter: counterReducer,
		users: usersReducer,
	},
});
