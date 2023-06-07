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

	// Get who has a debt with logged in user
	let debtWith = "";
	if (debt.debtor == session.user.id) {
		// User is debtor
		debtWith = getName(debt.creditor, users, session);
	} else {
		// User is cerditor
		debtWith = getName(debt.debtor, users, session);
	}

	return (
		<ClickableCard
			title={debtWith}
			pretitle="Debt with"
			badge={getStatus(debt.status, unreceived)}
			href={`/debts/${debt._id}`}
			className={`${className ? className : ""}`}>
			<TextWithTitle
				pretitle="Debt"
				title={<Money amount={debt.amount} notColoured small />}
				text={
					debt.debtor == session.user.id
						? debt.status == "closed"
							? "You owed"
							: `You owe`
						: debt.status == "closed"
						? `${debtWith} owed me`
						: `${debtWith} owes me`
				}
				align="left"
				reverse
				className={styles.amount}
			/>
			<p className={styles.date}>Opened {formatDate(debt.dateCreated)}</p>
		</ClickableCard>
	);
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
