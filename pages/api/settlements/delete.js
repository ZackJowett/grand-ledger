import dbConnect from "/utils/mongodb";
import Settlement from "/utils/models/settlement";
import Debt from "/utils/models/debt";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const settlement = await Settlement.findByIdAndDelete(req.body.id);

		// Change all debt status to "outstanding"
		// Change status of debts to pending
		for (let i = 0; i < settlement.debts.length; i++) {
			await Debt.findOneAndUpdate(
				{ _id: settlement.debts[i] },
				{ status: "outstanding", settlement: settlement._id },
				{ new: true }
			);
		}

		res.status(201).json({ success: true, data: settlement });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
