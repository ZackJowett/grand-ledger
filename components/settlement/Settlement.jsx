import styles from "./Settlement.module.scss";
import ClickableCard from "/components/card/ClickableCard";
import TextWithTitle from "/components/text/title/TextWithTitle";
import { getName, formatDate } from "/utils/helpers";
import Link from "next/link";
import Button from "/components/button/Button";
import Money from "/components/text/money/Money";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";

export default function Settlement({ settlement, className }) {
	const { data: session } = useSession();
	const userState = useSelector((state) => state.users);
	const users = userState.list;
	if (!userState.ready) return;

	// Set who is settling with you
	// It shows the name of the user who is not logged in
	const isSettler = settlement.settler == session.user.id;
	let settleWith = "";
	if (settlement.settler == session.user.id) {
		settleWith = getName(settlement.settlee, users, session);
	} else {
		settleWith = getName(settlement.settler, users, session);
	}

	return (
		<ClickableCard
			href={`/settlements/${settlement._id}`}
			title={settleWith}
			badge={
				settlement.status == "reopened"
					? "Reopened"
					: settlement.status == "pending"
					? "Pending"
					: "Closed"
			}
			className={`${styles.card} ${className}`}
			pretitleClassName={styles.title}
			includeArrow>
			<div className={styles.details}>
				<div className={styles.descWrapper}>
					<div className={styles.type}>Settlement</div>
					<div className={styles.description}>
						{settlement.description}
					</div>
				</div>
				<TextWithTitle
					title={
						<Money
							amount={settlement.netAmount}
							notColoured={true}
							backgroundDark={settlement.status == "outstanding"}
							className={styles.money}
							padding
							small
						/>
					}
					// text={"Amount"}
					align="left"
					reverse
					className={styles.amount}
				/>
			</div>
			{/* <p className={styles.date}>
				{settlement.status == "closed"
					? `Closed ${formatDate(settlement.dateClosed)}`
					: settlement.status == "reopened"
					? `Reopened ${formatDate(settlement.dateReopened)}`
					: `Opened ${formatDate(settlement.dateCreated)}`}
			</p> */}

			{settlementAction(settlement, session, users)}
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
