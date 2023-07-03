import Card from "components/card/Card";
import Debt from "components/debt/Debt";
import styles from "./DebtsIncluded.module.scss";
import { useSession } from "next-auth/react";
import { useStore } from "react-redux";
import { CardPlaceholder } from "components/placeholders/Placeholders";

export default function DebtsIncluded({ debts, stats }) {
	const { data: session } = useSession();

	const state = useStore().getState();

	console.log(stats);

	return (
		<Card className={styles.wrapper} dark>
			<div className={styles.debts}>
				{debts && debts.length > 0 ? (
					debts.map((debt, index) => {
						return (
							<Debt
								key={debt._id}
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
					<>
						<CardPlaceholder />
						<CardPlaceholder />
					</>
				)}
			</div>
		</Card>
	);
}
