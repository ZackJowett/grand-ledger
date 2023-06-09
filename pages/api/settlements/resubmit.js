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
		settlement.status = "pending";
		await settlement.save();

		// Create notification
		createNotification(
			settlement.settler,
			[settlement.settlee],
			"settlement-resubmit",
			settlement._id
		);

		res.status(200).json({ success: true, settlement: settlement });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
