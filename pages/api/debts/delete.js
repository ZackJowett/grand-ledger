import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const debt = await Debt.findByIdAndDelete(req.body.id);
		res.status(201).json({ success: true, data: debt });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
