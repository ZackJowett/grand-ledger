import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";
import User from "/utils/models/user";
import Debt from "/utils/models/debt";
import Settlement from "/utils/models/settlement";

export default async function handler(req, res) {
	await dbConnect();

	try {
		// Leave group
		const user = await User.findById(req.body.user);
		if (!user) {
			console.log("User not found");
			res.status(200).json({ success: false, data: null });
		}

		// Check if use has outstanding or pending debts
		const debts = await Debt.find({
			$and: [
				{
					$or: [
						{ debtor: req.body.user },
						{ creditor: req.body.user },
					],
				},
				{ status: { $ne: "closed" } },
				{ group: req.body.group },
			],
		});

		console.log(debts);

		if (debts.length > 0) {
			throw new Error("Close all debts before leaving group");
		}

		// Check if user has pending or reopened settlements
		const settlements = await Settlement.find({
			$and: [
				{
					$or: [
						{ settler: req.body.user },
						{ settlee: req.body.user },
					],
				},
				{ status: { $ne: "closed" } },
				{ group: req.body.group },
			],
		});

		if (settlements.length > 0) {
			throw new Error("Close all settlements before leaving group");
		}

		// Remove user from group members
		const group = await Group.findById(req.body.group);
		if (!group) {
			console.log("Group not found");
			res.status(200).json({ success: false, data: null });
		}

		group.members = group.members.filter(
			(member) => member != req.body.user
		);
		group.admins = group.admins.filter((admin) => admin != req.body.user);
		group.creator = null;
		await group.save();

		// Set user selected group
		user.selectedGroup = null;
		await user.save();

		res.status(200).json({ success: true, data: group });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
