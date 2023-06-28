import dbConnect from "/utils/mongodb";
import User from "/utils/models/user";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	const saltRounds = 10;
	const unHashedPassword = req.body.newPassword;

	// Hash password
	await bcrypt.hash(
		unHashedPassword,
		saltRounds,
		async function (err, hashedPassword) {
			// Store hash in DB
			if (err) {
				throw new Error("Failed Hashing Password: ", err);
			} else {
				try {
					const updatedUser = await User.findOneAndUpdate(
						{ email: req.body.email },
						{ password: hashedPassword },
						{ new: true }
					);
					res.status(201).json({ success: true, data: updatedUser });
				} catch (error) {
					console.log(error);
					res.status(400).json({ success: false, message: error });
				}
			}
		}
	);
}
