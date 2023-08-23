import dbConnect from "/utils/mongodb";
import Settlement from "/utils/models/settlement";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let query = {};

		console.log("--------------------", req.query, "--------------------");

		if (req.query.userId1 && req.query.userId2 && req.query.group) {
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
						{ group: req.query.group },
					],
				};
			}
		}

		console.log(query.$and[0].$or);

		// Find debts with query
		// then sort by date created in descending order
		const settlements = await Settlement.find(query).sort({
			dateCreated: "descending",
		});

		console.log(settlements);

		// Return sorted debts
		res.status(200).json({ success: true, data: settlements });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
