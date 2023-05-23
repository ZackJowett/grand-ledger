import dbConnect from "/utils/mongodb";
import Settlement from "/utils/models/settlement";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let settlements = null;

		// Get all settlements
		await Settlement.find({})
			.sort({ dateCreated: "descending" })
			.then((res) => {
				console.log("Result : ", res);
				settlements = res;
			})
			.catch((err) => console.log(err));

		res.status(200).json({ success: true, data: settlements });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
