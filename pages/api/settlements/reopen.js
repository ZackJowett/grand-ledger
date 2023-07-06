import dbConnect from "/utils/mongodb";
import Settlement from "/utils/models/settlement";
import Debt from "/utils/models/debt";
import { createNotification } from "/utils/data/notification";

export default async function handler(req, res) {
	await dbConnect();

	try {
		const settlement = await Settlement.findById(req.query.id).catch(
			(err) => console.log(err)
		);

		// Set settlement status to closed and save
		settlement.status = "reopened";
		settlement.dateReopened = Date.now();
		settlement.reopenedReason = req.body.reason;
		await settlement.save();

		// Create notification
		createNotification(
			settlement.settlee,
			[settlement.settler],
			"settlement-reopen",
			settlement._id
		);

		res.status(200).json({ success: true, settlement: settlement });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
