import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";
import { createNotification } from "/utils/data/notification";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const debt = await Debt.create({
			creditor: req.body.creditor,
			debtor: req.body.debtor,
			creator: req.body.creator,
			amount: req.body.amount,
			description: req.body.description,
		});

		const recipient =
			req.body.creditor === req.body.creator
				? req.body.debtor
				: req.body.creditor;

		createNotification(
			req.body.creator,
			[recipient],
			"debt-create",
			debt._id
		);

		res.status(201).json({ success: true, data: debt });
		return;
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
