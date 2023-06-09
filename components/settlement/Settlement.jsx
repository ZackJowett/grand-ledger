import styles from "./Settlement.module.scss";
import ClickableCard from "/components/card/ClickableCard";
import TextWithTitle from "/components/text/title/TextWithTitle";
import { getName, formatDate } from "/utils/helpers";
import Link from "next/link";
import Button from "/components/button/Button";
import Money from "/components/text/money/Money";

export default function Settlement({ settlement, globals, className }) {
	// Set who is settling with you
	// It shows the name of the user who is not logged in
	let settleWith = "";
	if (settlement.settler == globals.session.user.id) {
		settleWith = getName(
			settlement.settlee,
			globals.users,
			globals.session
		);
	} else {
		settleWith = getName(
			settlement.settler,
			globals.users,
			globals.session
		);
	}

	return (
		<ClickableCard
			href={`/settlements/${settlement._id}`}
			pretitle="Settlement"
			title={settleWith}
			badge={
				settlement.status == "reopened"
					? "Reopened"
					: settlement.status == "pending"
					? "Pending"
					: "Closed"
			}
			className={`${styles.card} ${className}`}
			pretitleClassName={styles.title}>
			<div className={styles.details}>
				<TextWithTitle
					title={
						<Money
							amount={settlement.netAmount}
							notColoured
							backgroundDark
							backgroundFit
							padding
							small
						/>
					}
					text="Amount"
					align="left"
					reverse
					className={styles.amount}
				/>
				<div className={styles.descWrapper}>
					<p className={styles.descTitle}>Description</p>
					{settlement.description}
				</div>
			</div>
			{/* <p className={styles.date}>
				{settlement.status == "closed"
					? `Closed ${formatDate(settlement.dateClosed)}`
					: settlement.status == "reopened"
					? `Reopened ${formatDate(settlement.dateReopened)}`
					: `Opened ${formatDate(settlement.dateCreated)}`}
			</p> */}

			{settlementAction(settlement, globals.session, globals.users)}
		</ClickableCard>
	);
}

function settlementAction(settlement, session, users) {
	const settleeName = getName(settlement.settlee, users, session);
	const settlerName = getName(settlement.settler, users, session);

	if (settlement.status == "reopened") {
		// Settlement is open (rejected by someone)
		if (settlement.settler != session.user.id) {
			// Rejector was logged in user since only settlees can reject a settlement
			return (
				<>
					<hr className={styles.hr} />
					<Button
						title={`WAITING FOR ${settlerName.toUpperCase()} TO RESUBMIT`}
						link={`/settlements/${settlement._id}`}
						className={styles.button}
						disabled
					/>
					<p className={styles.note}>
						You previously rejected this settlement.
					</p>
				</>
			);
		} else {
			// Rejector was not logged in user
			return (
				<>
					<hr className={styles.hr} />
					<Button
						title="SUBMIT SETTLEMENT AGAIN"
						className={styles.button}
						href={`/settlements/${settlement._id}`}
					/>
					<p className={styles.note}>
						Settlement was rejected by {settleeName}.
					</p>
				</>
			);
		}
	} else if (settlement.status == "pending") {
		// Settlement as been submitted and is pending review from other user
		if (settlement.settler == session.user.id) {
			// Waiting review from not logged in user
			return (
				<>
					<hr className={styles.hr} />
					<p className={styles.note}>
						{`Waiting for ${settleeName} to review.`}
					</p>
				</>
			);
		} else {
			return (
				<>
					<hr className={styles.hr} />
					<Button
						title="REVIEW TO CLOSE"
						link={`/settlements/${settlement._id}`}
						className={styles.button}
					/>
				</>
			);
		}
	} else {
		return null;
	}
}
