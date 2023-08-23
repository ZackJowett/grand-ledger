import dbConnect from "/utils/mongodb";
import Settlement from "/utils/models/settlement";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Request parameter checking
		if (
			!req.query.id ||
			!req.query.group ||
			req.query.group == null ||
			req.query.id == null
		) {
			throw new Error("Invalid request parameters");
		}

		// Get all settlements with specific user as settler or settlee
		// Sort by date created in descending order
		const settlements = await Settlement.find({
			$and: [
				{
					$or: [{ settler: req.query.id }, { settlee: req.query.id }],
				},
				{ group: req.query.group },
			],
		}).sort({ dateCreated: "descending" });

		res.status(200).json({ success: true, data: settlements });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
