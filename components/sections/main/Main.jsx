import styles from "./Main.module.scss";
import { useSession } from "next-auth/react";
import Button from "../../button/Button";
import NetPosition from "../../sections/stats/NetPosition";
import RecentSettlements from "../../sections/recents/RecentSettlements";
import RecentDebts from "../../sections/recents/RecentDebts";
import Card from "components/card/Card";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Main() {
	const { data: session } = useSession();
	const [fact, setFact] = useState(null);

	useEffect(() => {
		fetch("http://numbersapi.com/random/trivia")
			.then((res) => res.text())
			.then((data) => {
				setFact(data);
			});
	}, []);

	return (
		<div className={styles.main}>
			<div className={styles.overview}>
				<Card
					title={
						<Link href="/profile">Hello, {session.user.name}</Link>
					}
					subtitle={
						fact
							? `Did you know, the number ${fact}`
							: "Loading fact..."
					}
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

			<RecentSettlements />
			<RecentDebts />
			<br />
		</div>
	);
}
