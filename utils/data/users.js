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

// SET BSB & ACC: /api/users/setBankDetails
// Returns all users
export async function setBankDetails(id, bsb, acc) {
	try {
		const res = await fetch(`${getRootURL()}api/users/setBankDetails`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id, bsb, acc }),
		});

		return await res.json();
	} catch (error) {
		console.log(error);
		return null;
	}
}

// Update Email: /api/users/updateEmail
// Returns all users
export async function updateEmail(email, newEmail) {
	try {
		const res = await fetch(`${getRootURL()}api/users/updateEmail`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, newEmail }),
		});

		return await res.json();
	} catch (error) {
		console.log(error);
		return null;
	}
}

// Update Email: /api/users/updateEmail
// Returns all users
export async function updatePassword(email, newPassword) {
	try {
		const res = await fetch(`${getRootURL()}api/users/updatePassword`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, newPassword }),
		});

		return await res.json();
	} catch (error) {
		console.log(error);
		return null;
	}
}

// Set Avatar: /api/users/setAvatar
// Sets the url of a users' avatar
export async function setAvatar(id, url) {
	try {
		const res = await fetch(`${getRootURL()}api/users/setAvatar`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id, url }),
		});

		return await res.json();
	} catch (error) {
		console.log(error);
		return null;
	}
}

// Set Selected Group: /api/users/setSelectedGroup
// Sets the selected group of a user
export async function setSelectedGroup(user, group) {
	try {
		const res = await fetch(`${getRootURL()}api/users/setSelectedGroup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user, group }),
		});

		return res.json();
	} catch (error) {
		console.log(error);
		return null;
	}
}
