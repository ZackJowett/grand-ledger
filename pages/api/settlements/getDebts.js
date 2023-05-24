import dbConnect from "/utils/mongodb";
import Settlement from "/utils/models/settlement";
import Debt from "/utils/models/debt";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Find one settlement and get all debts included in it
		const settlement = await Settlement.findOne({
			_id: req.query.id,
		}).catch((err) => console.log(err));

		// Now find all debts in this settlement
		const debts = await Debt.find({ _id: { $in: settlement.debts } }).catch(
			(err) => console.log(err)
		);

		res.status(200).json({ success: true, data: debts });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
