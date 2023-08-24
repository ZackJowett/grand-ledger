// api/users/stats.js

import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";
import Settlement from "/utils/models/settlement";

// Get all statistics about a users
// Number of settlements (open, closed, pending), number of debts (open, closed), total debt, total unreceived payments, net position etc.
export default async function handler(req, res) {
	try {
		// Connect to database (connection is likely cached if not first time)
		await dbConnect();

		let statistics = {
			settlements: {
				asSettler: 0,
				asSettlee: 0,
				reopened: 0,
				pending: 0,
				closed: 0,
			},
			debts: {
				asCreditor: 0,
				asDebtor: 0,
				outstanding: 0,
				pending: 0,
				closed: 0,
			},
			current: {
				debt: 0,
				unreceived: 0,
				net: 0,
			},
			total: {
				debts: 0,
				settlements: 0,
				unreceived: 0,
				paidAmount: 0,
				pendingAmount: 0,
				receivedAmount: 0,
			},
		};

		// ----- SETTLEMENTS ----- \\
		const settlements = await Settlement.find({
			$and: [
				{ $or: [{ settler: req.query.id }, { settlee: req.query.id }] },
				{ group: req.query.group },
			],
		});
		const debts = await Debt.find({
			$and: [
				{
					$or: [{ creditor: req.query.id }, { debtor: req.query.id }],
				},
				{ group: req.query.group },
			],
		});

		settlements.forEach((settlement) => {
			statistics.total.settlements++;
			// Increment created as settler or settlee statistics
			if (settlement.settler == req.query.id) {
				// User is settler
				statistics.settlements.asSettler++;
			} else {
				// User is NOT settler
				statistics.settlements.asSettlee++;
			}

			// Increment open, pending, closed statistics
			if (settlement.status == "reopened") {
				statistics.settlements.reopened++;
			} else if (settlement.status == "pending") {
				statistics.settlements.pending++;
			} else {
				statistics.settlements.closed++;
			}
		});

		// ----- DEBTS ----- \\
		debts.forEach((debt) => {
			// Increment created as debtor or creditor statistics
			if (debt.debtor == req.query.id) {
				statistics.total.debts++;
				// User is debtor
				statistics.debts.asDebtor++;

				if (debt.status == "outstanding") {
					statistics.debts.outstanding++;
					statistics.current.debt -= debt.amount;
					statistics.current.net -= debt.amount; // Net position
				} else if (debt.status == "pending") {
					statistics.debts.pending++;
					statistics.total.pendingAmount += debt.amount;
				} else {
					statistics.debts.closed++;
					statistics.total.paidAmount += debt.amount;
				}
			} else {
				// User is creditor
				statistics.debts.asCreditor++;
				statistics.total.unreceived++;
				if (debt.status == "outstanding") {
					statistics.current.unreceived += debt.amount;
					statistics.current.net += debt.amount; // Net position
				} else if (debt.status == "pending") {
					statistics.total.pendingAmount += debt.amount;
				} else {
					statistics.total.receivedAmount += debt.amount;
				}
			}
		});

		res.status(200).json({ success: true, data: statistics });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
