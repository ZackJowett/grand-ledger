import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";
import User from "/utils/models/user";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Set user selected group
		const user = await User.findById(req.body.user);
		console.log(user);

		if (!user) {
			throw new Error("User not found");
		}

		user.selectedGroup = req.body.group;
		await user.save();

		res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
