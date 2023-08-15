import styles from "./Main.module.scss";
import { useSession } from "next-auth/react";
import NetPosition from "../../sections/stats/NetPosition";
import RecentSettlements from "../../sections/recents/RecentSettlements";
import RecentDebts from "../../sections/recents/RecentDebts";
import { useEffect, useState } from "react";
import Title from "components/text/title/TextWithTitle";

export default function Main() {
	const { data: session } = useSession();
	const [fact, setFact] = useState(null);

	useEffect(() => {
		getFact();
	}, []);

	function getFact() {
		fetch("https://cat-fact.herokuapp.com/facts/random")
			.then((res) => res.json())
			.then((data) => {
				if (data.status.verified) {
					setFact(data.text);
				} else {
					getFact();
				}
			});
	}

	return (
		<div className={styles.main}>
			<div className={styles.overview}>
				<div className={styles.welcome}>
					<Title title={`Hello, ${session.user.name}`} align="left" />
					<p className={styles.fact}>
						{fact ? fact : "Loading fact..."}
					</p>
				</div>

				<NetPosition />

				{/* <div className={styles.buttonWrapper}>
					<Button
						title="CREATE NEW DEBT"
						href="/debts/create"
						className={styles.newDebt}
					/>
				</div> */}
			</div>

			<RecentSettlements />
			<RecentDebts />
			<br />
		</div>
	);
}
