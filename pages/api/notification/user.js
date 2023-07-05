import dbConnect from "/utils/mongodb";
import Notification from "/utils/models/notification";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let notifications = null;

		// Get all notifications for a user
		await Notification.find({ recipients: req.query.id })
			.sort({ dateCreated: "descending" })
			.then((res) => {
				notifications = res;
			})
			.catch((err) => console.log(err));

		res.status(200).json({ success: true, data: notifications });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
