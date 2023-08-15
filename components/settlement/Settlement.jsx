import styles from "./Settlement.module.scss";
import ClickableCard from "/components/card/ClickableCard";
import TextWithTitle from "/components/text/title/TextWithTitle";
import { getName, formatDate } from "/utils/helpers";
import Link from "next/link";
import Button from "/components/button/Button";
import Money from "/components/text/money/Money";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";

export default function Settlement({ settlement, className, light = false }) {
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
			className={`${styles.card} ${
				settlement.status != "closed" ? styles.showAction : ""
			} ${className}`}
			pretitleClassName={styles.title}
			light={light}
			includeArrow
			action={settlementAction(settlement, session, users)}>
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
				<div className={styles.action}>
					<h5>Waiting for {settlerName} to Resubmit</h5>
					<p className={styles.note}>
						You previously rejected this settlement
					</p>
				</div>
			);
		} else {
			// Rejector was not logged in user
			return (
				<div className={styles.action}>
					<h5>Submit Settlement again</h5>
					<p className={styles.note}>
						Settlement was rejected by {settleeName}
					</p>
				</div>
			);
		}
	} else if (settlement.status == "pending") {
		// Settlement as been submitted and is pending review from other user
		if (settlement.settler == session.user.id) {
			// Waiting review from not logged in user
			return (
				<div className={styles.action}>
					<p className={styles.note}>
						Waiting for {settleeName} to Review
					</p>
				</div>
			);
		} else {
			return (
				<div className={styles.action}>
					<h5>Review to Close</h5>
					<p className={styles.note}>
						{settlerName} is waiting for you
					</p>
				</div>
			);
		}
	} else {
		return null;
	}
}
