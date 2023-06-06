// Description: This file contains the functions that interact with the debts API.
import { quickFetch, getRootURL } from "/utils/helpers";

// GET ONE: /api/debts
// Returns a single debt object with the given id
export async function getOneDebt(id) {
	try {
		return await quickFetch(`${getRootURL()}api/debts?id=${id}`);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL FOR DEBTOR: /api/debts?debtor=userId
// Returns all debts for a given debtor
export async function getAllForDebtor(id) {
	try {
		return await quickFetch(`${getRootURL()}api/debts?debtor=${id}`);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL FOR CREDITOR: /api/debts?creditor=userId
// Returns all debts for a given creditor
export async function getAllForCreditor(id) {
	try {
		return await quickFetch(`${getRootURL()}api/debts?creditor=${id}`);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL BETWEEN TWO USERS: /api/users?userId1=[id]&userId2=[id]
// Returns all users between two users
export async function getAllBetweenTwoUsers(id1, id2) {
	try {
		return await quickFetch(
			`${getRootURL()}api/debts?userId1=${id1}&userId2=${id2}`
		);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL: /api/debts
// Returns all debts
export async function getAllDebts() {
	try {
		return await quickFetch(`${getRootURL()}api/debts`);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// POST ALL DEBTS
export async function postDebts(debts, userId) {
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
					amount: currentDebt.amount,
					description: currentDebt.description,
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
							amount: currentParty.amount,
							description: currentDebt.description,
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

		return { success: true, data: await Promise.all(promises) };
	} catch (error) {
		console.log(error);
		return { success: false, error: error };
	}
}
