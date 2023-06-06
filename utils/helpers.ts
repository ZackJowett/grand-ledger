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

// Distributes amount evenly across piles
// a pile is like one person in a group
// Splits whole values evenly then distributes remainder evenly across piles
// by adding 0.01 at a time
const distributeAmount = (amount, piles) => {
	if (piles < 2) return [amount]; // if only one pile, no need to split

	// Split amount into piles excluding remainders
	const split = Math.floor((amount / piles) * 100) / 100; // round down to 2 decimal places

	// Fill array with split amounts
	const amounts = Array(piles).fill(split);

	// get remainder amount rounded to closest 2 decimal places
	let remainder = Math.round((amount - split * piles) * 100) / 100;

	// Split remainder evenly across piles adding 0.01 at a time
	while (remainder > 0) {
		for (let i = 0; i < piles; i++) {
			if (remainder > 0) {
				amounts[i] += 0.01;
				remainder -= 0.01;
			}
		}
	}

	// Remove floating point errors
	amounts.forEach((amount, i) => {
		amounts[i] = Math.round(amount * 100) / 100;
	});

	return amounts;
};

module.exports = {
	formatDate,
	getName,
	quickFetch,
	getRootURL,
	filterDebts,
	filterSettlements,
	distributeAmount,
};
