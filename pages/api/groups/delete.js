import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const group = await Group.findByIdAndDelete(req.body.group);

		res.status(201).json({ success: true, data: group });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
