import Card from "components/card/Card";
import Debt from "components/debt/Debt";
import styles from "./DebtsIncluded.module.scss";
import { useSession } from "next-auth/react";
import { useStore } from "react-redux";

export default function DebtsIncluded({ debts, stats }) {
	const { data: session } = useSession();

	const state = useStore().getState();

	console.log(stats);

	return (
		<Card title="Debts Included" className={styles.wrapper} dark>
			<div className={styles.debts}>
				{debts ? (
					debts.map((debt, index) => {
						return (
							<Debt
								key={index}
								debt={debt}
								globals={{
									session: session,
									users: state.userList.users,
								}}
								className={styles.debt}
							/>
						);
					})
				) : (
					<p>Loading...</p>
				)}
			</div>
		</Card>
	);
}
