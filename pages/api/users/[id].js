import dbConnect from "/lib/mongodb";
import User from "/lib/models/user";

export default async function handler(req, res) {
	await dbConnect();

	try {
		const user = await User.findOne({ username: req.query.id });
		res.status(200).json({ success: true, user: user });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
