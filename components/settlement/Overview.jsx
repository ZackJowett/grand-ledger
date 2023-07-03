import Card from "../card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./Overview.module.scss";
import Money from "components/text/money/Money";
import Spinner from "components/placeholders/spinner/Spinner";

export default function Overview({ stats, otherPartyName }) {
	return (
		<Card dark>
			<div className={styles.totalsWrapper}>
				<TextWithTitle
					title={`Total owed to ${otherPartyName}`}
					text={
						<Money
							amount={-stats.debt}
							className={styles.debt}
							background
							small
						/>
					}
					className={styles.textWithTitle}
					align="left"
					tiny
				/>
				<TextWithTitle
					title={`Total ${otherPartyName} owed me`}
					text={
						<Money
							amount={stats.unreceived}
							className={styles.unreceived}
							background
							small
						/>
					}
					className={styles.textWithTitle}
					align="right"
					tiny
				/>
			</div>

			<TextWithTitle
				title="Net Total"
				text={
					<Money
						amount={stats.total}
						className={
							stats.total >= 0 ? styles.unreceived : styles.debt
						}
						background
						includeSign
					/>
				}
				className={styles.total}
			/>
		</Card>
	);
}
