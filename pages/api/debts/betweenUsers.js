import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let query = {};

		// if group is provideed but it is null
		if (!req.query.group || req.query.group == null) {
			res.status(400).json({
				success: false,
				message: "No group provided",
			});
		}

		if (!req.query.userId1 || !req.query.userId2) {
			res.status(400).json({
				success: false,
				message: "User ids not provided",
			});
			return;
		}

		// get all debts between two parties
		if (req.query.status == null) {
			// Not getting closed debts
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
					{ status: { $ne: "closed" } },
					{ group: req.query.group },
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
					{ group: req.query.group },
				],
			};
		}

		// Find debts with query
		// then sort by date created in descending order
		let debts = await Debt.find(query).sort({ dateCreated: "descending" });

		// Return sorted debts
		res.status(200).json({ success: true, data: debts });
	} catch (error) {
		console.log("ERROR (betweenUsers.js)", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
