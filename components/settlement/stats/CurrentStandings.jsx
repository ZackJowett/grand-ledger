import Card from "components/card/Card";
import styles from "./CurrentStandings.module.scss";
import { getDebtStatusForUser } from "utils/data/debts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Spinner from "components/placeholders/spinner/Spinner";
import Money from "components/text/money/Money";

export default function CurrentStandings() {
	const { data: session, status: sessionStatus } = useSession();
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		if (sessionStatus !== "authenticated") return;

		getDebtStatusForUser(session.user.id).then((res) => {
			setData(res);
			setLoading(false);
		});

		console.log("FETCHING STAT");
	}, []);

	return (
		<Card dark title="Current Debts">
			{loading ? (
				<Spinner />
			) : data ? (
				<div className={styles.container}>
					{data.map((user) => (
						<div key={user.id} className={styles.user}>
							<div className={styles.name}>{user.name}</div>
							<Money amount={user.amountNet} small />
						</div>
					))}
				</div>
			) : (
				"Failed to load"
			)}
		</Card>
	);
}
