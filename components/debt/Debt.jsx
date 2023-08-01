import styles from "./Debt.module.scss";
import ClickableCard from "/components/card/ClickableCard";
import TextWithTitle from "/components/text/title/TextWithTitle";
import { getName, formatDate } from "/utils/helpers";
import Money from "/components/text/money/Money";
import { useSession } from "next-auth/react";
import { getDebtStatus } from "/utils/helpers";
import { useSelector } from "react-redux";

export default function Debt({ debt, className }) {
	const { data: session } = useSession();
	const userState = useSelector((state) => state.users);
	if (!userState.ready) return;
	const users = userState.list;

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
				// pretitle="Debt"
				badge={getDebtStatus(debt.status, !userIsDebtor)}
				href={`/debts/${debt._id}`}
				className={`${styles.cardDebt} ${className ? className : ""}`}
				pretitleClassName={styles.title}>
				<div className={styles.details}>
					<div className={styles.descWrapper}>
						{/* <p className={styles.descTitle}>Description</p> */}
						{debt.description}
					</div>
					<TextWithTitle
						pretitle="Debt"
						title={
							<Money
								amount={-debt.amount}
								notColoured={debt.status != "outstanding"}
								backgroundDark={debt.status == "outstanding"}
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
					{debt.status == "outstanding" || debt.status == "pending"
						? `Opened ${formatDate(debt.dateCreated)}`
						: `Closed ${formatDate(debt.dateClosed)}`}
				</p> */}
			</ClickableCard>
		);
	} else {
		// User is creditor, return unreceived payment style card
		return (
			<ClickableCard
				title={debtWith}
				pretitle={
					debt.status != "closed"
						? "Unreceived Payment"
						: "Received Payment"
				}
				badge={getDebtStatus(debt.status, !userIsDebtor)}
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
								padding
								small
								className={styles.money}
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

				{/* <p className={styles.date}>
					{debt.status == "outstanding" || debt.status == "pending"
						? `Opened ${formatDate(debt.dateCreated)}`
						: `Closed ${formatDate(debt.dateClosed)}`}
				</p> */}
			</ClickableCard>
		);
	}
}
