import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let debts = null;

		// Get all debts with creditor as the requested id
		// Sort by date created in descending order
		if (req.query.debtor) {
			await Debt.find({ debtor: req.query.debtor })
				.sort({ dateCreated: "descending" })
				.then((res) => {
					console.log("Result : ", res);
					debts = res;
				})
				.catch((err) => console.log(err));

			res.status(200).json({ success: true, data: debts });
		} else if (req.query.creditor) {
			await Debt.find({ creditor: req.query.creditor })
				.sort({ dateCreated: "descending" })
				.then((res) => {
					console.log("Result : ", res);
					debts = res;
				})
				.catch((err) => console.log(err));

			res.status(200).json({ success: true, data: debts });
		}
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
