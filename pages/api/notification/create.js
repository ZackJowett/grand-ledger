import dbConnect from "/utils/mongodb";
import Notification from "/utils/models/notification";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Check if notification of same type already exists
		const existingNotification = await Notification.findOne({
			creator: req.body.creator,
			recipients: req.body.recipients,
			type: req.body.type,
			target: req.body.target,
		});

		if (existingNotification) {
			res.status(400).json({
				success: false,
				message: "already-created",
			});
			return;
		}

		const notification = await Notification.create({
			creator: req.body.creator,
			recipients: req.body.recipients,
			type: req.body.type,
			target: req.body.target,
		});

		res.status(200).json({ success: true, data: notification });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
