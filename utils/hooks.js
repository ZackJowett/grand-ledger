import useSWR from "swr";
import { getRootURL, quickFetch } from "utils/helpers";

const fetcher = (url) => quickFetch(url);
export function useUserDebtStats(id) {
	const { data, error, isLoading } = useSWR(
		`${getRootURL()}api/debts/stats?id=${id}`,
		fetcher
	);

	return {
		data: data,
		isLoading,
		isError: error,
	};
}
