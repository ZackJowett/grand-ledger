// api/users.js

import dbConnect from "/lib/mongodb";
import User from "/lib/models/user";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const user = await User.create({
			username: "zaack",
			password: "password",
			name: "Zack",
			email: "zack@zack.zac",
		});
		res.status(201).json({ success: true, data: user });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
