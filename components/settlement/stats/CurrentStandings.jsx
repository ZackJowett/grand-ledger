import Card from "components/card/Card";
import styles from "./CurrentStandings.module.scss";
import { useSession } from "next-auth/react";
import Spinner from "components/placeholders/spinner/Spinner";
import Money from "components/text/money/Money";
import { useUsers, useUserDebtStats } from "utils/hooks";
import Title from "components/text/title/TextWithTitle";

export default function CurrentStandings({ setSelectedUser }) {
	const { data: session } = useSession();
	const { data: stats, isLoading: statsLoading } = useUserDebtStats(
		session.user.id
	);
	const { data: users, isLoading: usersLoading } = useUsers();

	let debts = [];
	let unreceived = [];

	if (!statsLoading && stats) {
		stats.forEach((stat) => {
			if (stat.amountNet < 0) {
				debts.push(stat);
			} else if (stat.amountNet > 0) {
				unreceived.push(stat);
			}
		});
	}

	return (
		<Card dark title="Current Debts">
			{statsLoading || usersLoading ? (
				<Spinner />
			) : stats ? (
				<div className={styles.container}>
					<div className={styles.section}>
						<Title title="You owe" small />
						{debts.map((stat) => {
							return (
								<div
									className={styles.user}
									onClick={() =>
										setSelectedUser(
											users.find(
												(user) => user._id == stat.id
											)
										)
									}>
									<div className={styles.name}>
										{stat.name}
									</div>
									<Money
										amount={stat.amountNet}
										small
										includeSign
									/>
								</div>
							);
						})}
					</div>

					<div className={styles.section}>
						<Title title="You are owed" small />
						{unreceived.map((stat) => {
							return (
								<div
									className={styles.user}
									onClick={() =>
										setSelectedUser(
											users.find(
												(user) => user._id == stat.id
											)
										)
									}>
									<div className={styles.name}>
										{stat.name}
									</div>
									<Money
										amount={stat.amountNet}
										small
										includeSign
									/>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				"Failed to load"
			)}
		</Card>
	);
}
