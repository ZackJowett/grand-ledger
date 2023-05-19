import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";
import { useSession } from "next-auth/react";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		const debtor = await fetch(
			`http://localhost:3000/api/users/user1`
		).then((res) => res.json().then((data) => data.user));

		const debt = await Debt.create({
			creditor: req.body.userId,
			debtor: debtor._id,
			amount: req.body.amount,
			description: req.body.description,
		});
		res.status(201).json({ success: true, data: debt });
		return;
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}
