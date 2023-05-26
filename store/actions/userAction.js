import { GET_USERS, USERS_ERROR } from "../types";
import { getAllUsers } from "../../utils/data/users";

export const getUsers = () => async (dispatch) => {
	try {
		const data = await getAllUsers();
		console.log("GETTING USERS");

		dispatch({
			type: GET_USERS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USERS_ERROR,
			payload: error,
		});
	}
};
