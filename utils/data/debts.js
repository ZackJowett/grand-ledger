// Description: This file contains the functions that interact with the debts API.
import { quickFetch, getRootURL } from "/utils/helpers";

// GET ONE: /api/debts
// Returns a single debt object with the given id
export async function getOneDebt(id) {
	try {
		let data = null;
		await quickFetch(`${getRootURL()}api/debts?id=${id}`).then((res) => {
			data = res[0];
		});

		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL FOR DEBTOR: /api/debts?debtor=userId
// Returns all debts for a given debtor
export async function getAllForDebtor(id, group) {
	try {
		return await quickFetch(
			`${getRootURL()}api/debts?debtor=${id}&group=${group}`
		);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL FOR CREDITOR: /api/debts?creditor=userId
// Returns all debts for a given creditor
export async function getAllForCreditor(id, group) {
	try {
		return await quickFetch(
			`${getRootURL()}api/debts?creditor=${id}&group=${group}`
		);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL BETWEEN TWO USERS: /api/users?userId1=[id]&userId2=[id]
// Returns all users between two users
export async function getAllBetweenTwoUsers(id1, id2, group) {
	try {
		return await quickFetch(
			`${getRootURL()}api/debts?userId1=${id1}&userId2=${id2}&group=${group}`
		);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET DEBT STATIS: /api/users/stats?userId=[id]
// Returns all users between two users
export async function getDebtStatusForUser(id, group) {
	try {
		console.log("FETCHING");
		return await quickFetch(
			`${getRootURL()}api/debts/stats?id=${id}&group=${group}`
		);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL: /api/debts
// Returns all debts
export async function getAllDebts(group) {
	try {
		return await quickFetch(`${getRootURL()}api/debts?group=${group}`);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// POST ALL DEBTS
export async function postDebts(debts, userId, group) {
	try {
		const promises = [];

		for (let i = 0; i < debts.length; i++) {
			const currentDebt = debts[i];

			if (currentDebt.type === "single") {
				// Single debt, create and post

				// Get if user is creditor or debtor
				const setCreditor =
					currentDebt.createAs === "creditor"
						? userId
						: currentDebt.otherParty;
				const setDebtor =
					currentDebt.createAs === "debtor"
						? userId
						: currentDebt.otherParty;

				// Create object
				const newDebt = {
					creditor: setCreditor,
					debtor: setDebtor,
					creator: userId,
					amount: currentDebt.amount,
					description: currentDebt.description,
					group: group,
				};

				// Post
				promises.push(
					await fetch(`${getRootURL()}api/debts/newDebt`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(newDebt),
					})
				);
			} else if (currentDebt.type === "multi") {
				// Multi debt, need to convert to single debts and post
				for (let j = 0; j < currentDebt.parties.length; j++) {
					const currentParty = currentDebt.parties[j];

					// Don't create a debt for the user with self
					if (currentParty.id !== userId) {
						// Create new debt object
						const newDebt = {
							creditor: userId,
							debtor: currentParty.id,
							creator: userId,
							amount: currentParty.amount,
							description: currentDebt.description,
							group: group,
						};

						promises.push(
							await fetch(`${getRootURL()}api/debts/newDebt`, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(newDebt),
							})
						);
					}
				}
			}
		}
		// Check each response of promise to see if success: true
		// If not, return error
		for (let i = 0; i < promises.length; i++) {
			const currentResponse = await promises[i].json();
			if (!currentResponse.success) {
				throw new Error("Error posting debts");
			}
		}

		return { success: true, data: await Promise.all(promises) };
	} catch (error) {
		console.log(error);
		return { success: false, error: error };
	}
}

// GET ALL: /api/debts
// Returns all debts
export async function deleteDebt(id) {
	try {
		const res = await fetch(`${getRootURL()}api/debts/delete`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: id }),
		});
		return res.json();
	} catch (error) {
		console.log(error);
		return null;
	}
}
