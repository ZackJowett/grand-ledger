import Card from "/components/card/Card";
import { useEffect, useState } from "react";
import { getUserStats } from "/utils/data/users";
import Money from "/components/text/money/Money";
import TextWithButton from "/components/text/title/TextWithButton";
import TextWithTitle from "components/text/title/TextWithTitle";
import { useSession } from "next-auth/react";
import styles from "./NetPosition.module.scss";

export default function NetPosition() {
	const { data: session } = useSession();

	const [stats, setStats] = useState(null);

	const dailyFact = "The current world population is 7.8 billion";

	useEffect(() => {
		if (!session) return;

		getUserStats(session.user.id).then((data) => {
			data ? setStats(data) : console.log("Error fetching user stats");
		});
	}, [session]);

	if (!session) return;

	return (
		<Card title={`Hello, ${session.user.name}`} subtitle={dailyFact} dark>
			{stats ? (
				<>
					<TextWithButton
						text="Total Debt"
						title={<Money amount={stats.current.debt} />}
						buttonTitle="PAY NOW"
						link="/settlements/create"
						align="left"
						reverse
						large
						className={styles.totalDebt}
					/>
					<TextWithButton
						text="Total Unreceived"
						title={<Money amount={stats.current.unreceived} />}
						buttonTitle="VIEW"
						link="/unreceived-payments"
						align="left"
						reverse
						large
						className={styles.totalUnreceived}
					/>
					<hr className={styles.hr} />
					<TextWithTitle
						title={<Money amount={stats.current.net} includeSign />}
						text="Net Position"
						large
						className={`${
							stats.current.net >= 0
								? styles.positive
								: styles.negative
						} ${styles.netPosition}
						`}
					/>
				</>
			) : (
				<p>Loading...</p>
			)}
		</Card>
	);
}
