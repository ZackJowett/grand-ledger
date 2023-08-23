import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";

export default async function handler(req, res) {
	await dbConnect();

	try {
		const group = await Group.findById(req.query.id);

		if (!group) {
			res.status(200).json({ success: false, data: null });
		}

		res.status(200).json({ success: true, data: group });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
