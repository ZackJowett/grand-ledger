// Takes a date string, converts it to a date object, and
// returns a formatted date string
// Input | date: string
// Output | string
function formatDate(date) {
	const dateObject = new Date(date);
	const formattedDate = new Intl.DateTimeFormat("en-GB", {
		dateStyle: "medium",
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

// Fetches data from custom API, checks success and returns JSON object with data
async function quickFetch(url) {
	const data = fetch(url)
		.then((res) => res.json())
		.then((data) => {
			if (!data.success) {
				console.log("Error in quickFetch()");
				return;
			}
			return data.data;
		});
	return data;
}

function getRootURL() {
	if (process.env.NODE_ENV == "development") {
		return "http://localhost:3000/";
	} else if (process.env.NODE_ENV == "production") {
		return "https://grand-ledger.vercel.app/";
	}
}

// Filters debts
const filterDebts = (debt, filter) => {
	if (!filter) return true;
	if (filter == "all") return true;
	if (filter == "outstanding" && debt.status == "outstanding") return true;
	if (filter == "pending" && debt.status == "pending") return true;
	if (filter == "closed" && debt.status == "closed") return true;

	// No match found
	return false;
};

// Filters Settlements
const filterSettlements = (settlement, filter) => {
	if (!filter) return true;
	if (filter == "all") return true;
	if (filter == "pending" && settlement.status == "pending") return true;
	if (filter == "reopened" && settlement.status == "reopened") return true;
	if (filter == "closed" && settlement.status == "closed") return true;

	// No match found
	return false;
};

module.exports = {
	formatDate,
	getName,
	quickFetch,
	getRootURL,
	filterDebts,
	filterSettlements,
};
