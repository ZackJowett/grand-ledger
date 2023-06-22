import dbConnect from "/utils/mongodb";
import User from "/utils/models/user";

export default async function handler(req, res) {
	// Connect to database (connection is likely cached if not first time)
	await dbConnect();
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.body.id },
			{ bsb: req.body.bsb, accountNumber: req.body.acc },
			{ new: true }
		);

		res.status(200).json({ success: true, data: updatedUser });
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Failed to update details",
		});
	}
}
