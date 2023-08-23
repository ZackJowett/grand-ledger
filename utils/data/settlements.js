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

// CLOSE SETTLEMENT: /api/settlements/close
// Returns all debts contained a specific settlement
export async function closeSettlement(id) {
	try {
		const response = await fetch(
			`${getRootURL()}api/settlements/close?id=${id}`,
			{
				method: "POST",
			}
		);
		return json;
	} catch (error) {
		console.log(error);
		return null;
	}
}

// REJECT SETTLEMENT: /api/settlements/close
// Returns all debts contained a specific settlement
export async function reopenSettlement(id, reason) {
	try {
		const response = await fetch(
			`${getRootURL()}api/settlements/reopen?id=${id}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},

				body: JSON.stringify({ reason: reason }),
			}
		);
		const json = response.json();
		return json;
	} catch (error) {
		console.log(error);
		return null;
	}
}

// REJECT SETTLEMENT: /api/settlements/close
// Returns all debts contained a specific settlement
export async function resubmitSettlement(id) {
	try {
		const response = await fetch(
			`${getRootURL()}api/settlements/resubmit?id=${id}`,
			{
				method: "POST",
			}
		);
		const json = response.json();
		return json;
	} catch (error) {
		console.log(error);
		return null;
	}
}

// CREATE NEW SETTLEMENT: /api/settlements/create
export async function createSettlement(settlement, creator) {
	try {
		const newSettlement = {
			settler: settlement.settler,
			settlee: settlement.settlee,
			creator: creator,
			debts: settlement.debts,
			netAmount: settlement.netAmount,
			description: settlement.description,
			group: settlement.group,
		};

		console.log(newSettlement);

		const response = await fetch(`${getRootURL()}api/settlements/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify(newSettlement),
		});
		const json = await response.json();
		if (!json.success) {
			throw new Error("Error creating settlement");
		}

		return { success: true, data: json.data };
	} catch (error) {
		console.log(error);
		return null;
	}
}

// DELETE SETTLEMENT: /api/debts
// Returns all debts
export async function deleteSettlement(id) {
	try {
		const res = await fetch(`${getRootURL()}api/settlements/delete`, {
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
