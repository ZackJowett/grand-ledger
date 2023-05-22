// Takes a date string, converts it to a date object, and
// returns a formatted date string
// Input | date: string
// Output | string
function formatDate(date) {
	const dateObject = new Date(date);
	const formattedDate = new Intl.DateTimeFormat("en-GB", {
		dateStyle: "full",
		timeStyle: "short",
		timeZone: "Australia/Sydney",
		hourCycle: "h12",
	}).format(dateObject);
	return formattedDate;
}

// Gets user name from user id
// If the user id is the same as the session user id, return "You"
// Input | id: string, users: User[], session: Session
// Output | string
const getName = (id, users, session) => {
	if (!users) return;

	if (id == session.user.id) return "You"; // user id same as session user id

	const user = users.find((user) => user._id == id); // find user with id

	if (!user) {
		// if no user found, return
		console.log("Error, user not found in getName()");
		return id;
	}

	return user.name;
};

module.exports = { formatDate, getName };
