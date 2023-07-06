import { useEffect } from "react";

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
				console.log("Error quick fetching: ", data.message);
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
		return "https://www.grandledger.app/";
	}
}

// Filters debts
const filterDebts = (debt, status, user) => {
	let includeDebt = true;

	// Ceck user filter
	if (user !== null) {
		if (debt.creditor != user && debt.debtor != user) {
			includeDebt = false;
		}
	}

	// Check status filter
	if (status !== null && status !== "all") {
		if (debt.status != status) {
			includeDebt = false;
		}
	}

	// No match found
	return includeDebt;
};

// Filters Settlements
const filterSettlements = (settlement, status, user) => {
	let includeSettlement = true;

	// Ceck user filter
	if (user !== null) {
		if (settlement.settler != user && settlement.settlee != user) {
			includeSettlement = false;
		}
	}

	// Check status filter
	if (status !== null && status !== "all") {
		if (settlement.status != status) {
			includeSettlement = false;
		}
	}

	// No match found
	return includeSettlement;
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

// Decifers the correct terminology for a debt status if unreceived payment or not
function getDebtStatus(debtStatus, unreceived) {
	if (debtStatus == "closed") {
		return "Closed";
	} else if (debtStatus == "outstanding") {
		// Return "Unreceived" if the debt is viewed as an unreceived payment
		// otherwise just return "Outstanding"
		return unreceived ? "Unreceived" : "Outstanding";
	} else if (debtStatus == "pending") {
		return "Pending";
	}
	console.log("ERROR getting debt status");
	return "";
}

// Time since a given date
function timeSince(date) {
	if (typeof date !== "object") {
		date = new Date(date);
	}

	const now = new Date();

	var seconds = Math.floor((now.valueOf() - date) / 1000);
	var intervalType;

	var interval = Math.floor(seconds / 31536000);
	if (interval >= 1) {
		intervalType = "year";
	} else {
		interval = Math.floor(seconds / 2592000);
		if (interval >= 1) {
			intervalType = "month";
		} else {
			interval = Math.floor(seconds / 86400);
			if (interval >= 1) {
				intervalType = "day";
			} else {
				interval = Math.floor(seconds / 3600);
				if (interval >= 1) {
					intervalType = "hour";
				} else {
					interval = Math.floor(seconds / 60);
					if (interval >= 1) {
						intervalType = "minute";
					} else if (seconds < 9) {
						return "now";
					} else {
						interval = seconds;
						intervalType = "second";
					}
				}
			}
		}
	}

	if (interval > 1 || interval === 0) {
		intervalType += "s";
	}

	return interval + " " + intervalType;
}

module.exports = {
	formatDate,
	getName,
	quickFetch,
	getRootURL,
	filterDebts,
	filterSettlements,
	distributeAmount,
	getDebtStatus,
	timeSince,
};
