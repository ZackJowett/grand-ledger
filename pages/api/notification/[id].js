import dbConnect from "/utils/mongodb";
import Notification from "/utils/models/notification";

export default async function handler(req, res) {
	await dbConnect();

	try {
		const notification = await Notification.findById(req.query.id);
		res.status(200).json({ success: true, data: notification });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
