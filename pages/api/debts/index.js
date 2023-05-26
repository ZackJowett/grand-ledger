import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let query = {};
		let sortedDebts = null;

		if (req.query.userId1 && req.query.userId2) {
			// get all debts between two parties
			if (req.query.status == null) {
				// Not getting closed debts
				query = {
					$or: [
						{
							creditor: req.query.userId1,
							debtor: req.query.userId2,
						},
						{
							creditor: req.query.userId2,
							debtor: req.query.userId1,
						},
					],
				};
			} else {
				// Getting debt with specified status
				query = {
					$and: [
						{
							$or: [
								{
									creditor: req.query.userId1,
									debtor: req.query.userId2,
								},
								{
									creditor: req.query.userId2,
									debtor: req.query.userId1,
								},
							],
						},
						{ status: req.query.status },
					],
				};
			}
		} else if (req.query.debtor && req.query.creditor) {
			// get specific creditor and debtor debt between two parties
			query = { debtor: req.query.debtor, creditor: req.query.creditor };
		} else if (req.query.debtor) {
			// Get all debts with debtor as the requested id
			// Sort by date created in descending order
			query = { debtor: req.query.debtor };
		} else if (req.query.creditor) {
			// Get all debts with creditor as the requested id
			// Sort by date created in descending order
			query = { creditor: req.query.creditor };
		} else if (req.query.id) {
			// Get specific debt with id

			query = { _id: req.query.id };
		} else {
			// get all debts
			query = {};
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
