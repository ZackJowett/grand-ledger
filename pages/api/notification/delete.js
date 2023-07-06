import dbConnect from "/utils/mongodb";
import Notification from "/utils/models/notification";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const notification = await Notification.findByIdAndDelete(req.body.id);
		res.status(201).json({ success: true, data: notification });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
