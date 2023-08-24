import dbConnect from "/utils/mongodb";
import User from "/utils/models/user";
import Settlement from "/utils/models/settlement";
import Group from "/utils/models/group";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// const group = await Group.findOne({ _id: "64e6e673943f74fc68ef2088" });
		// //  For each settlements without a group, set it's group to BB&A group
		// const settlements = await Settlement.find({ group: null });

		// for (let i = 0; i < settlements.length; i++) {
		// 	const settlement = settlements[i];

		// 	settlement.group = group._id;

		// 	await settlement.save();
		// 	// console.log(settlement);
		// }

		res.status(200).json({
			success: true,
			data: "DONE",
		});
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false });
	}
}
