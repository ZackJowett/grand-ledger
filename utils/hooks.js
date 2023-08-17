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
	};
}

// ------------------------------- DEBTS -------------------------------- \\
export function useDebts() {
	const { data, error, isLoading } = useSWR(`api/debts`, fetcher);

	return {
		data: data,
		isLoading,
		isError: error,
	};
}

export function useDebtsBetweenUsers(id1, id2) {
	const { data, error, isLoading } = useSWR(
		`api/debts?userId1=${id1}&userId2=${id2}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
	};
}

export function useDebtsBetweenUsersOutstanding(id1, id2) {
	const { data, error, isLoading } = useSWR(
		`api/debts?userId1=${id1}&userId2=${id2}&status=outstanding`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
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
	};
}
