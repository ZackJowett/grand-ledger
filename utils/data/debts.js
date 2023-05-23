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
