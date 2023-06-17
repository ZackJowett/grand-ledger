// api/users.js

import dbConnect from "/utils/mongodb";
import User from "/utils/models/user";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();
	try {
		let users = null;
		if (req.body.email) {
			users = await User.findOne({ email: req.body.email });
		} else {
			users = await User.find({});
		}

		if (users == null) {
			res.status(400).json({
				success: false,
				message: "Users not found",
			});
		}

		res.status(200).json({ success: true, data: users });
	} catch (error) {
		res.status(400).json({ success: false, message: error });
	}
}
