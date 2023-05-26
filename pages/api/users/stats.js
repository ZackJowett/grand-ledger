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
				totalSettled: 0,
			},
			debts: {
				asCreditor: 0,
				asDebtor: 0,
				oustanding: 0,
				pending: 0,
				closed: 0,
				totalPending: 0,
				totalPaid: 0,
				totalReceived: 0,
			},
			current: {
				debt: 0,
				unreceived: 0,
				net: 0,
			},
		};

		// ----- SETTLEMENTS ----- \\
		const settlements = await Settlement.find({
			$or: [{ settler: req.query.id }, { settlee: req.query.id }],
		});
		const debts = await Debt.find({
			$or: [{ creditor: req.query.id }, { debtor: req.query.id }],
		});

		settlements.forEach((settlement) => {
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

				// Increment total amount settled statistics
				statistics.settlements.totalSettled += settlement.netAmount;
			}
		});

		// ----- DEBTS ----- \\
		debts.forEach((debt) => {
			// Increment created as debtor or creditor statistics
			if (debt.creditor == req.query.id) {
				// User is creditor
				statistics.debts.asCreditor++;
			} else {
				// User is debtor
				statistics.debts.asDebtor++;
			}

			// Increment open, closed statistics
			if (debt.status == "oustanding") {
				// Debt is open
				statistics.debts.oustanding++;

				// Increment total debt
				if (debt.debtor == req.query.id) {
					statistics.current.debt += debt.amount;
					statistics.current.net -= debt.amount; // Net position
				} else {
					// Increment total unreceived
					statistics.current.unreceived += debt.amount;
					statistics.current.net += debt.amount; // Net position
				}
			} else if (debt.status == "pending") {
				// Debt is pending
				statistics.debts.pending++;
				statistics.debts.totalPending += debt.amount;
			} else {
				// Debt is closed
				statistics.debts.closed++;

				// Increment total amount paid debt
				if (debt.debtor == req.query.id) {
					statistics.debts.totalPaid += debt.amount;
				} else {
					statistics.debts.totalReceived += debt.amount;
				}
			}
		});

		res.status(200).json({ success: true, data: statistics });
	} catch (error) {
		res.status(400).json({ success: false });
	}
}
