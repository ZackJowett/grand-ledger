import { quickFetch, getRootURL } from "/utils/helpers";

// Create new group
export async function createGroup(name, members, admins, creator) {
	try {
		const group = {
			name,
			members,
			admins,
			creator,
		};

		const res = await fetch(`${getRootURL()}api/groups/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(group),
		});

		return res.json();
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

// Create new group
export async function getGroup(id) {
	try {
		const res = await fetch(`${getRootURL()}api/groups/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return res.json();
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

// Leave group
export async function leaveGroup(user, group) {
	try {
		const res = await fetch(`${getRootURL()}api/groups/leave`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user, group }),
		});

		return res.json();
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

// Join group
export async function joinGroup(user, code) {
	try {
		console.log("joining...");
		const res = await fetch(`${getRootURL()}api/groups/join`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user, code }),
		});

		return res.json();
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
}

// Join group
export async function deleteGroup(group) {
	try {
		console.log("joining...");
		const res = await fetch(`${getRootURL()}api/groups/delete`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ group }),
		});

		return res.json();
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
}
