import styles from "./Main.module.scss";
import { useSession } from "next-auth/react";
import Button from "../../button/Button";
import NetPosition from "../../sections/stats/NetPosition";
import RecentSettlements from "../../sections/recents/RecentSettlements";
import RecentDebts from "../../sections/recents/RecentDebts";
import { useStore } from "react-redux";

export default function Main() {
	const { data: session } = useSession();

	// const state = useStore().getState();

	return (
		<div className={styles.main}>
			<div className={styles.overview}>
				<NetPosition />

				<div className={styles.buttonWrapper}>
					<Button
						title="CREATE NEW DEBT"
						href="/debts/create"
						className={styles.newDebt}
					/>
				</div>
			</div>

			<RecentSettlements className={styles.settlements} />
			<RecentDebts className={styles.debts} />
			<br />
		</div>
	);
}
