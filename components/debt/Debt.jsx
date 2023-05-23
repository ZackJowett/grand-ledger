import styles from "./Debt.module.scss";
import ClickableCard from "/components/card/ClickableCard";
import TextWithTitle from "/components/text/title/TextWithTitle";
import { getName, formatDate } from "/utils/helpers";
import Money from "/components/text/money/Money";

export default function Debt({ debt, globals }) {
	const shortDesc =
		debt.description.length > 25
			? debt.description.slice(0, 25) + "..."
			: debt.description;

	return (
		<ClickableCard
			title={getName(debt.creditor, globals.users, globals.session)}
			pretitle={debt.closed ? "I owed" : "I owe"}
			badge={debt.closed ? "Closed" : "Open"}
			href={`/debts/${debt._id}`}>
			<TextWithTitle
				title={<Money amount={debt.amount} />}
				text="Amount"
				align="left"
				reverse
				className={styles.amount}
			/>
			<TextWithTitle
				title={shortDesc}
				text="Description"
				align="left"
				reverse
				small
				className={styles.desc}
			/>

			<p className={styles.date}>Opened {formatDate(debt.dateCreated)}</p>
		</ClickableCard>
	);
}
