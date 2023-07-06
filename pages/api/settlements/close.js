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

		// Change status of debts to closed
		for (let i = 0; i < settlement.debts.length; i++) {
			await Debt.findOneAndUpdate(
				{ _id: settlement.debts[i]._id },
				{
					status: "closed",
					dateClosed: Date.now(),
				},
				{ new: true }
			);
		}

		// Set settlement status to closed and save
		settlement.status = "closed";
		settlement.dateClosed = Date.now();
		await settlement.save();

		// Create notification
		createNotification(
			settlement.settlee,
			[settlement.settler],
			"settlement-approve",
			settlement._id
		);

		res.status(200).json({ success: true, settlement: settlement });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
