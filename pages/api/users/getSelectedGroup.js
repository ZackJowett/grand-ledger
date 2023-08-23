import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";
import User from "/utils/models/user";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Get selected group
		const user = await User.findById(req.query.user);
		if (!user) {
			res.status(200).json({ success: false, data: null });
		}

		const group = await Group.findById(user.selectedGroup);

		if (!group) {
			res.status(200).json({ success: false, data: null });
		}

		res.status(200).json({ success: true, data: group });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
