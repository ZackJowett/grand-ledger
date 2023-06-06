import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const debt = await Debt.create({
			creditor: req.body.creditor,
			debtor: req.body.debtor,
			amount: req.body.amount,
			description: req.body.description,
		});
		res.status(201).json({ success: true, data: debt });
		return;
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
