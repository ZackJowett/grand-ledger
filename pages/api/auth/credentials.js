import dbConnect from "/lib/mongodb";

export default async function handler(req, res) {
	// Connect to database
	await dbConnect();

	// Authenticate Credentials
	const { username, password } = req.body;

	console.log(username, password);
}
