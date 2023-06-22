// api/users/egister.js
import bcrypt from "bcrypt";

import dbConnect from "/utils/mongodb";
import User from "/utils/models/user";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	const saltRounds = 10;
	const unHashedPassword = req.body.password;

	// Hash password
	await bcrypt.hash(
		unHashedPassword,
		saltRounds,
		function (err, hashedPassword) {
			// Store hash in your password DB.
			if (err) {
				throw new Error("Failed Hashing Password: ", err);
			} else {
				try {
					const user = User.create({
						email: req.body.email,
						password: hashedPassword,
						name: req.body.name,
					});
					res.status(201).json({ success: true, data: user });
				} catch (error) {
					console.log(error);
					res.status(400).json({ success: false, message: error });
				}
			}
		}
	);
}
