// api/users.js

import dbConnect from "/utils/mongodb";
import User from "/utils/models/user";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const user = await User.create({
			username: req.body.username,
			password: req.body.password,
			name: req.body.name,
			email: req.body.email,
		});
		res.status(201).json({ success: true, data: user });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
