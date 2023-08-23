import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";
import User from "/utils/models/user";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Leave group
		const user = await User.findById(req.body.user);
		if (!user) {
			console.log("User not found");
			res.status(200).json({ success: false, data: null });
		}

		// Remove user from group members
		const group = await Group.findById(req.body.group);
		if (!group) {
			console.log("Group not found");
			res.status(200).json({ success: false, data: null });
		}

		group.members = group.members.filter(
			(member) => member != req.body.user
		);
		group.admins = group.admins.filter((admin) => admin != req.body.user);
		group.creator = null;
		await group.save();

		// Set user selected group
		user.selectedGroup = null;
		await user.save();

		res.status(200).json({ success: true, data: group });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
