import styles from "./Debt.module.scss";
import ClickableCard from "/components/card/ClickableCard";
import TextWithTitle from "/components/text/title/TextWithTitle";
import { getName, formatDate } from "/utils/helpers";
import Money from "/components/text/money/Money";
import { useStore } from "react-redux";
import { useSession } from "next-auth/react";

export default function Debt({ debt, className, unreceived = false }) {
	const { data: session } = useSession();
	const state = useStore().getState();
	const users = state.userList.users;
	let userIsDebtor = debt.debtor == session.user.id;

	// Get who has a debt with logged in user
	let debtWith = "";
	if (userIsDebtor) {
		// User is debtor
		debtWith = getName(debt.creditor, users, session);
	} else {
		// User is cerditor
		debtWith = getName(debt.debtor, users, session);
	}

	if (userIsDebtor) {
		// User is debtor, return debt style card
		return (
			<ClickableCard
				title={debtWith}
				pretitle="Debt"
				badge={getStatus(debt.status, unreceived)}
				href={`/debts/${debt._id}`}
				className={`${styles.cardDebt} ${className ? className : ""}`}
				pretitleClassName={styles.title}>
				<div className={styles.details}>
					<TextWithTitle
						pretitle="Debt"
						title={
							<Money
								amount={-debt.amount}
								notColoured={debt.status != "outstanding"}
								backgroundDark
								backgroundFit
								padding
								small
							/>
						}
						text={"Amount"}
						align="left"
						reverse
						className={styles.amount}
					/>
					<div className={styles.descWrapper}>
						<p className={styles.descTitle}>Description</p>
						{debt.description}
					</div>
				</div>

				<p className={styles.date}>
					{debt.status == "outstanding" || debt.status == "pending"
						? `Opened ${formatDate(debt.dateCreated)}`
						: `Closed ${formatDate(debt.dateClosed)}`}
				</p>
			</ClickableCard>
		);
	} else {
		// User is creditor, return unreceived payment style card
		return (
			<ClickableCard
				title={debtWith}
				pretitle="Unreceived Payment"
				badge={getStatus(debt.status, unreceived)}
				href={`/debts/${debt._id}`}
				className={`${styles.cardUnreceived} ${
					className ? className : ""
				}`}
				pretitleClassName={styles.title}>
				<div className={styles.details}>
					<TextWithTitle
						pretitle="Debt"
						title={
							<Money
								amount={debt.amount}
								notColoured={debt.status != "outstanding"}
								backgroundDark
								backgroundFit
								padding
								small
							/>
						}
						text={"Amount"}
						align="left"
						reverse
						className={styles.amount}
					/>
					<div className={styles.descWrapper}>
						<p className={styles.descTitle}>Description</p>
						{debt.description}
					</div>
				</div>

				<p className={styles.date}>
					{debt.status == "outstanding" || debt.status == "pending"
						? `Opened ${formatDate(debt.dateCreated)}`
						: `Closed ${formatDate(debt.dateClosed)}`}
				</p>
			</ClickableCard>
		);
	}
}

function getStatus(debtStatus, unreceived) {
	if (debtStatus == "closed") {
		return "Closed";
	} else if (debtStatus == "outstanding") {
		// Return "Unreceived" if the debt is viewed as an unreceived payment
		// otherwise just return "Outstanding"
		return unreceived ? "Unreceived" : "Outstanding";
	} else if (debtStatus == "pending") {
		return "Pending";
	}
	console.log("ERROR getting debt status");
	return "";
}
