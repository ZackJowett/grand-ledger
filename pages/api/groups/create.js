import dbConnect from "/utils/mongodb";
import Group from "/utils/models/group";

export default async function handler(req, res) {
	await dbConnect();

	try {
		let group = null;

		while (group === null) {
			// Create new group
			let newGroup = await Group.create({
				code: generateCode(),
				name: req.body.name,
				members: req.body.members,
				admins: req.body.admins,
				creator: req.body.creator,
			});

			// Check if group was created
			if (newGroup) {
				group = newGroup;
			}
		}

		res.status(200).json({ success: true, data: group });
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

// generate join code
function generateCode() {
	let code = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const charactersLength = characters.length;

	for (let i = 0; i < 8; i++) {
		code += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return code;
}
