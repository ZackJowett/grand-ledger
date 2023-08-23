import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";
import User from "/utils/models/user";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Add user to group using code
		const group = await Group.findOne({ code: req.body.code });
		if (!group) {
			throw new Error("Group not found");
		}

		console.log(group);

		await group.members.push(req.body.user);
		await group.save();

		// If user does not have a selected group, set it to this group
		const user = await User.findById(req.body.user);
		if (!user) {
			throw new Error("User not found");
		}

		if (!user.selectedGroup) {
			user.selectedGroup = group._id;
			await user.save();
		}

		res.status(200).json({ success: true, data: group });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
