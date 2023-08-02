import Card from "components/card/Card";
import styles from "./CurrentStandings.module.scss";
import { useSession } from "next-auth/react";
import Spinner from "components/placeholders/spinner/Spinner";
import Money from "components/text/money/Money";
import { useUserDebtStats } from "utils/hooks";
import { useSelector } from "react-redux";

export default function CurrentStandings({ setSelectedUser }) {
	const { data: session } = useSession();
	const { data, isLoading } = useUserDebtStats(session.user.id);
	const state = useSelector((state) => state);
	const users = state.users.list;

	return (
		<Card dark title="Current Debts">
			{isLoading ? (
				<Spinner />
			) : data ? (
				<div className={styles.container}>
					{data.map((stat) => (
						<div
							key={stat.id}
							className={styles.user}
							onClick={() =>
								setSelectedUser(
									users.find((user) => user._id == stat.id)
								)
							}>
							<div className={styles.name}>{stat.name}</div>
							<Money amount={stat.amountNet} small includeSign />
						</div>
					))}
				</div>
			) : (
				"Failed to load"
			)}
		</Card>
	);
}
