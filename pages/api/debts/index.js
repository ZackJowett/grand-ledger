import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";
import User from "/utils/models/user";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let query = {};
		let sortedDebts = null;

		if (req.query.debtor && req.query.creditor) {
			// get specific creditor and debtor debt between two parties
			query = {
				debtor: req.query.debtor,
				creditor: req.query.creditor,
				group: req.query.group,
			};
		} else if (req.query.debtor) {
			// Get all debts with debtor as the requested id
			// Sort by date created in descending order
			query = { debtor: req.query.debtor, group: req.query.group };
		} else if (req.query.creditor) {
			// Get all debts with creditor as the requested id
			// Sort by date created in descending order
			query = { creditor: req.query.creditor, group: req.query.group };
		} else if (req.query.id) {
			// Get specific debt with id

			query = { _id: req.query.id };
		} else {
			// get all debts in group
			query = { group: req.query.group };
		}

		// Add status to query if it exists
		if (req.query.status && !req.query.userId1 && !req.query.userId2) {
			// don't need to add when its two parties
			query.status = req.query.status;
		}

		// Find debts with query
		// then sort by date created in descending order
		await Debt.find(query)
			.sort({ dateCreated: "descending" })
			.then((res) => {
				sortedDebts = res;
			})
			.catch((err) => console.log(err));

		// Return sorted debts
		res.status(200).json({ success: true, data: sortedDebts });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
