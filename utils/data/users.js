// Description: This file contains the functions that interact with the users API.
import { quickFetch, getRootURL } from "/utils/helpers";

// GET ONE: /api/users/[id]
// Returns a single user object with the given id
export async function getOne(id) {
	try {
		return await quickFetch(`${getRootURL()}api/users/${id}`);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET STATS: /api/users/stats
// Returns statistics about a user
export async function getUserStats(id) {
	try {
		return await quickFetch(`${getRootURL()}api/users/stats?id=${id}`);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL: /api/users
// Returns all users
export async function getAllUsers() {
	try {
		return await quickFetch(`${getRootURL()}api/users`);
	} catch (error) {
		console.log(error);
		return null;
	}
}
