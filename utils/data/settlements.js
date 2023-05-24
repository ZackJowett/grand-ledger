// Description: This file contains the functions that fetch data from the server related to settlements.
import { quickFetch, getRootURL } from "/utils/helpers";

// GET ONE: /api/settlements/getAll
// Returns all settlements for a given user ( no matter settler or settlee)
export async function getSettlementByID(id) {
	try {
		return await quickFetch(`${getRootURL()}api/settlements?id=${id}`);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET SETTLEMENT DEBTS: /api/settlements/getDebts
// Returns all debts contained a specific settlement
export async function getSettlementDebts(id) {
	try {
		return await quickFetch(
			`${getRootURL()}api/settlements/getDebts?id=${id}`
		);
	} catch (error) {
		console.log(error);
		return null;
	}
}

// GET ALL: /api/settlements/getAll
// Returns all settlements for a given user ( no matter settler or settlee)
export async function getAllSettlements(id = null) {
	try {
		if (id == null) {
			return await quickFetch(`${getRootURL()}api/settlements/getAll`);
		} else {
			return await quickFetch(
				`${getRootURL()}api/settlements/getByUsers?id=${id}`
			);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}
