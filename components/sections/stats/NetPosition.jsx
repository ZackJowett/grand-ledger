import Card from "/components/card/Card";
import Money from "/components/text/money/Money";
import TextWithTitle from "components/text/title/TextWithTitle";
import { useSession } from "next-auth/react";
import styles from "./NetPosition.module.scss";
import { NetPositionPlaceholder } from "/components/placeholders/Placeholders";
import { useUserStats, useSelectedGroup } from "/utils/hooks";
import Spinner from "/components/placeholders/spinner/Spinner";

export default function NetPosition() {
	const { data: session } = useSession();
	const group = useSelectedGroup(session ? session.user.id : null);
	const stats = useUserStats(
		session ? session.user.id : null,
		group.exists ? group.data._id : null
	);

	if (!session) return;

	return (
		<>
			<div className={styles.wrapper}>
				<Card
					className={styles.netWrapper}
					action={<p className={styles.action}>Net Position</p>}
					reverseAction>
					{stats.isLoading ? (
						<Spinner />
					) : !stats.exists ? (
						"Error loading stats"
					) : (
						<Money
							amount={stats.data.current.net}
							notColoured
							includeSign
						/>
					)}
				</Card>
				<div className={styles.individualDebtTotals}>
					<Card
						className={styles.debtWrapper}
						href="/debts"
						action={<p className={styles.action}>Total Debt</p>}
						reverseAction
						includeArrow>
						{stats.isLoading ? (
							<Spinner />
						) : !stats.exists ? (
							"Error loading stats"
						) : (
							<Money amount={stats.data.current.debt} />
						)}
					</Card>

					<Card
						className={styles.unreceivedWrapper}
						href="/unreceived-payments"
						action={
							<p className={styles.action}>Total Unreceived</p>
						}
						reverseAction
						includeArrow>
						{stats.isLoading ? (
							<Spinner />
						) : !stats.exists ? (
							"Error loading stats"
						) : (
							<Money amount={stats.data.current.unreceived} />
						)}
					</Card>
				</div>
			</div>
		</>
	);
}
