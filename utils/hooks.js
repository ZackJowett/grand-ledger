import useSWR from "swr";
import { getRootURL } from "utils/helpers";

const fetcher = async (url) => {
	const res = await fetch(getRootURL() + url);

	// If the status code is not in the range 200-299,
	// we still try to parse and throw it.
	if (!res.ok) {
		const error = new Error("An error occurred while fetching the data.");
		// Attach extra info to the error object.
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}

	const json = await res.json();

	if (!json.success) {
		const error = new Error("An error occurred while fetching the data.");
		// Attach extra info to the error object.
		error.info = "Error";
	}

	return json.data;
};

// ------------------------------- USERS -------------------------------- \\
export function useUsers() {
	const { data, error, isLoading } = useSWR(`api/users`, fetcher);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

export function useSelectedGroup(user) {
	const { data, error, isLoading, mutate } = useSWR(
		`api/users/getSelectedGroup?user=${user}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
		mutate: mutate,
	};
}

// ------------------------------- DEBTS -------------------------------- \\
export function useDebt(id) {
	const { data, error, isLoading } = useSWR(`api/debts?id=${id}`, fetcher);

	// returns array of length 1
	return {
		data: data ? data[0] : null,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

export function useDebts() {
	const { data, error, isLoading } = useSWR(`api/debts`, fetcher);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

export function useDebtsBetweenUsers(id1, id2, group, status = null) {
	const { data, error, isLoading } = useSWR(
		`api/debts/betweenUsers?userId1=${id1}&userId2=${id2}&group=${group}&status=${status}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

export function useDebtorDebts(debtor, group) {
	const { data, error, isLoading, mutate } = useSWR(
		`api/debts?debtor=${debtor}&group=${group}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data,
		mutate: mutate,
	};
}

export function useCreditorDebts(creditor, group) {
	const { data, error, isLoading, mutate } = useSWR(
		`api/debts?creditor=${creditor}&group=${group}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
		mutate: mutate,
	};
}

// ------------------------------- SETTLEMENTS -------------------------------- \\
export function useSettlement(id) {
	const { data, error, isLoading } = useSWR(
		`api/settlements?id=${id}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

export function useSettlementDebts(id) {
	const { data, error, isLoading } = useSWR(
		`api/settlements/getDebts?id=${id}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

export function useSettlementsBetweenUsers(id1, id2, group) {
	const { data, error, isLoading } = useSWR(
		`api/settlements/getBetweenUsers?userId1=${id1}&userId2=${id2}&group=${group}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

export function useSettlementsWithUser(id, group) {
	const { data, error, isLoading } = useSWR(
		`api/settlements/getByUsers?id=${id}&group=${group}`,
		fetcher
	);

	return {
		data: data ? data : [],
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

// ------------------------------ GROUPS ------------------------------- \\
export function useGroup(id) {
	const { data, error, isLoading } = useSWR(`api/groups/${id}`, fetcher);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

export function useGroupsWithUser(user) {
	const { data, error, isLoading } = useSWR(
		`api/groups/getAllWithUser?user=${user}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

// ------------------------------ STATISTICS ------------------------------- \\
export function useUserDebtStats(id) {
	const { data, error, isLoading } = useSWR(
		`api/debts/stats?id=${id}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}

export function useUserStats(id) {
	const { data, error, isLoading } = useSWR(
		`api/users/stats?id=${id}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
		exists: !isLoading && !error && data != null,
	};
}
