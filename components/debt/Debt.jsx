import styles from "./Debt.module.scss";
import ClickableCard from "/components/card/ClickableCard";
import TextWithTitle from "/components/text/title/TextWithTitle";
import { getName, formatDate } from "/utils/helpers";
import Money from "/components/text/money/Money";
import { useSession } from "next-auth/react";
import { getDebtStatus } from "/utils/helpers";
import { useSelector } from "react-redux";

export default function Debt({ debt, className, light = false }) {
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

	// if (userIsDebtor) {
	// User is debtor, return debt style card
	return (
		<ClickableCard
			href={`/debts/${debt._id}`}
			title={debtWith}
			badge={getDebtStatus(debt.status, !userIsDebtor)}
			className={`${
				userIsDebtor ? styles.cardDebt : styles.cardUnreceived
			} ${className ? className : ""}`}
			pretitleClassName={styles.title}
			light={light}
			includeArrow>
			<div className={styles.details}>
				<div className={styles.descWrapper}>
					<DebtType status={debt.status} isDebtor={userIsDebtor} />
					<div className={styles.description}>{debt.description}</div>
				</div>

				<TextWithTitle
					pretitle="Debt"
					title={
						<Money
							amount={userIsDebtor ? -debt.amount : debt.amount}
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
		</ClickableCard>
	);
}

function DebtType({ status, isDebtor }) {
	const text = isDebtor
		? "Debt"
		: status === "outstanding"
		? "Unreceived Payment"
		: "Received Payment";
	const style = isDebtor ? styles.typeDebt : styles.typeUnreceived;

	return <div className={style}>{text}</div>;
}
