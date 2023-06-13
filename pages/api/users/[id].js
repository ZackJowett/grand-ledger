import dbConnect from "/utils/mongodb";
import User from "/utils/models/user";

export default async function handler(req, res) {
	await dbConnect();

	try {
		const user = await User.findById(req.query.id);
		console.log(user);
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
