// api/debts/stats.js
import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";
import User from "/utils/models/user";

// Get all statistics about a users debts & standings
export default async function handler(req, res) {
	try {
		// Connect to database (connection is likely cached if not first time)
		await dbConnect();

		let statistics = [];

		// users sorted by alphabetical order name
		const users = await User.find({}).sort({ name: 1 });

		// add all users to statistics object
		users.forEach((user) => {
			statistics.push({
				id: user._id.toString(),
				name: user.name,
				amountUserOwes: 0,
				amountUserIsOwed: 0,
				amountNet: 0,
			});
		});

		const debts = await Debt.find({
			$or: [{ creditor: req.query.id }, { debtor: req.query.id }],
			status: "outstanding",
			group: req.query.group,
		});

		// ----- DEBTS ----- \\
		debts.forEach((debt) => {
			// Increment created as debtor or creditor statistics

			if (debt.debtor == req.query.id) {
				// User is debtor
				var index = statistics.findIndex(
					(stat) => stat.id == debt.creditor
				);

				// Set statistic information with the other user
				statistics[index].amountUserOwes += debt.amount;
				statistics[index].amountNet -= debt.amount;
			} else {
				// User is creditor
				var index = statistics.findIndex(
					(stat) => stat.id == debt.debtor
				);
				// Set statistic information with the other user
				statistics[index].amountUserIsOwed += debt.amount;
				statistics[index].amountNet += debt.amount;
			}
		});

		// remove objects with 0 for all values
		statistics = statistics.filter(
			(stat) =>
				stat.amountUserIsOwed != 0 ||
				stat.amountUserOwes != 0 ||
				stat.amountNet != 0
		);

		// to fixed 2
		statistics.forEach((stat) => {
			stat.amountUserIsOwed = stat.amountUserIsOwed.toFixed(2);
			stat.amountUserOwes = stat.amountUserOwes.toFixed(2);
			stat.amountNet = stat.amountNet.toFixed(2);
		});

		res.status(200).json({ success: true, data: statistics });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
