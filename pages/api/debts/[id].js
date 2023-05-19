import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";

export default async function handler(req, res) {
	await dbConnect();

	try {
		const debts = await Debt.find({ creditor: req.query.id });
		res.status(200).json({ success: true, data: debts });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
