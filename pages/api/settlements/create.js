import dbConnect from "/utils/mongodb";
import Settlement from "/utils/models/settlement";
import Debt from "/utils/models/debt";
import { createNotification } from "/utils/data/notification";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Create new settlement with debts
		// number increments automatically
		// Status defaults to pending
		const settlement = await Settlement.create({
			settler: req.body.settler,
			settlee: req.body.settlee,
			creator: req.body.creator,
			debts: req.body.debts,
			netAmount: req.body.netAmount,
			description: req.body.description ? req.body.description : "",
			group: req.body.group,
		});

		// Change status of debts to pending
		for (let i = 0; i < req.body.debts.length; i++) {
			await Debt.findOneAndUpdate(
				{ _id: req.body.debts[i] },
				{ status: "pending", settlement: settlement._id },
				{ new: true }
			);
		}

		// Create notification
		const recipient =
			req.body.settler === req.body.creator
				? req.body.settlee
				: req.body.settler;

		createNotification(
			req.body.creator,
			[recipient],
			"settlement-create",
			settlement._id
		);

		res.status(200).json({ success: true, data: settlement });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
