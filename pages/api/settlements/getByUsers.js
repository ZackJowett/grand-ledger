import dbConnect from "/utils/mongodb";
import Settlement from "/utils/models/settlement";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let settlements = null;

		// Get all settlements with specific user as settler or settlee
		// Sort by date created in descending order
		await Settlement.find({
			$or: [{ settler: req.query.id }, { settlee: req.query.id }],
		})
			.sort({ dateCreated: "descending" })
			.then((res) => {
				settlements = res;
			})
			.catch((err) => console.log(err));

		res.status(200).json({ success: true, data: settlements });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
