import styles from "./Main.module.scss";
import { useSession } from "next-auth/react";
import Button from "../../button/Button";
import NetPosition from "../../sections/stats/NetPosition";
import RecentSettlements from "../../sections/recents/RecentSettlements";
import RecentDebts from "../../sections/recents/RecentDebts";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import Card from "components/card/Card";
import Link from "next/link";

export default function Main() {
	const { data: session } = useSession();

	const dailyFact = "The current world population is 7.8 billion";

	// User not logged in
	if (!session) {
		return <LoggedOut />;
	}

	return (
		<div className={styles.main}>
			<div className={styles.overview}>
				<Card
					title={
						<Link href="/profile">Hello, {session.user.name}</Link>
					}
					subtitle={dailyFact}
					className={styles.welcome}
				/>

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
