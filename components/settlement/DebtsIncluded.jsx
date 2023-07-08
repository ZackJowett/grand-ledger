import Card from "components/card/Card";
import Debt from "components/debt/Debt";
import styles from "./DebtsIncluded.module.scss";
import { CardPlaceholder } from "components/placeholders/Placeholders";

export default function DebtsIncluded({ debts, stats }) {
	return (
		<Card className={styles.wrapper} dark>
			<div className={styles.debts}>
				{debts && debts.length > 0 ? (
					debts.map((debt, index) => {
						return (
							<Debt
								key={debt._id}
								debt={debt}
								className={styles.debt}
							/>
						);
					})
				) : (
					<>
						<CardPlaceholder />
						<CardPlaceholder />
					</>
				)}
			</div>
		</Card>
	);
}
