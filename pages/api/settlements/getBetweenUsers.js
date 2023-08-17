import dbConnect from "/utils/mongodb";
import Settlement from "/utils/models/settlement";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let query = {};
		let sortedSettlements = null;

		if (req.query.userId1 && req.query.userId2) {
			// get all debts between two parties
			if (req.query.status == null) {
				// Not getting closed debts
				query = {
					$and: [
						{
							$or: [
								{
									settler: req.query.userId1,
									settlee: req.query.userId2,
								},
								{
									settler: req.query.userId2,
									settlee: req.query.userId1,
								},
							],
						},
						{ status: { $ne: "closed" } },
					],
				};
			} else {
				// Getting debt with specified status
				query = {
					$and: [
						{
							$or: [
								{
									settler: req.query.userId1,
									settlee: req.query.userId2,
								},
								{
									settler: req.query.userId2,
									settlee: req.query.userId1,
								},
							],
						},
						{ status: req.query.status },
					],
				};
			}
		}

		// Find debts with query
		// then sort by date created in descending order
		await Settlement.find(query)
			.sort({ dateCreated: "descending" })
			.then((res) => {
				sortedSettlements = res;
				console.log(res);
			})
			.catch((err) => console.log(err));

		// Return sorted debts
		res.status(200).json({ success: true, data: sortedSettlements });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
