import styles from "./Main.module.scss";
import { useSession } from "next-auth/react";
import Button from "../../button/Button";
import NetPosition from "../../sections/stats/NetPosition";
import RecentSettlements from "../../sections/recents/RecentSettlements";
import RecentDebts from "../../sections/recents/RecentDebts";
import LoggedOut from "../login/loggedOut/LoggedOut";

export default function Main() {
	const { data: session } = useSession();

	if (!session) {
		return <LoggedOut />;
	}

	return (
		<>
			<NetPosition />

			<div className={styles.buttonWrapper}>
				<Button
					title="CREATE NEW DEBT"
					href="/debts/create"
					className={styles.newDebt}
				/>
			</div>

			<RecentSettlements />

			<RecentDebts />
			<br />
		</>
	);
}
