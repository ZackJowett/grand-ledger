import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Get all groups with user where members array contains user id
		const groups = await Group.find({ members: req.query.user });

		res.status(200).json({ success: true, data: groups });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
