import dbConnect from "/utils/mongodb";
import Debt from "/utils/models/debt";
import { createNotification } from "/utils/data/notification";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();

	try {
		let debt = null;

		// Create debt, if debt id is not unique, try again
		while (debt === null) {
			const newDebt = await createDebt(req);
			if (newDebt !== null) {
				debt = newDebt;
			}
		}

		const recipient =
			req.body.creditor === req.body.creator
				? req.body.debtor
				: req.body.creditor;

		createNotification(
			req.body.creator,
			[recipient],
			"debt-create",
			debt._id
		);

		res.status(201).json({ success: true, data: debt });
		return;
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false });
	}
}

async function createDebt(req) {
	return await Debt.create({
		id: generateID(),
		creditor: req.body.creditor,
		debtor: req.body.debtor,
		creator: req.body.creator,
		amount: req.body.amount,
		description: req.body.description,
	});
}

// Generate an ID following the format "<day><month><year><random 6 digit number>"
function generateID() {
	let date = new Date();
	let day = date.getDate().toString();
	day = day < 10 ? "0" + day : day;

	// get month and add 0 if month is less than 10
	let month = date.getMonth() + 1;
	month = month < 10 ? "0" + month : month;

	// get only last 2 digits of year
	let year = date.getFullYear().toString().slice(2);

	let random = Math.floor(1000 + Math.random() * 9000);

	return day + month + year + random;
}
