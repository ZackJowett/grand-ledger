// api/users/egister.js

import dbConnect from "/utils/mongodb";
import User from "/utils/models/user";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const user = await User.create({
			email: req.body.email,
			password: req.body.password,
			name: req.body.name,
		});
		res.status(201).json({ success: true, data: user });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error });
	}
}
