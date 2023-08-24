import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";
import User from "/utils/models/user";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Get all users in group
		const group = await Group.findById(req.query.id);

		if (!group) throw new Error("Group not found");

		let users = [];

		for (let i = 0; i < group.members.length; i++) {
			const user = await User.findById(group.members[i]);
			users.push(user);
		}

		res.status(200).json({ success: true, data: users });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
