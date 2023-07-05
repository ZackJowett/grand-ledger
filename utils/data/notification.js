import { quickFetch, getRootURL } from "/utils/helpers";

// Create new notification
export async function createNotification(
	creator,
	recipients,
	type,
	target = null
) {
	try {
		const notification = {
			creator: creator,
			recipients: recipients,
			type: type,
			target: target,
		};

		const res = await fetch(`${getRootURL()}api/notification/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(notification),
		});

		return res.json();
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

// Get all notifications for a user
export async function getNotifications(userId) {
	try {
		return await quickFetch(
			`${getRootURL()}api/notification/user?id=${userId}`
		);
	} catch (error) {
		console.log(error);
		return null;
	}
}
