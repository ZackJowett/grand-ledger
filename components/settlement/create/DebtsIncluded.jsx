import Card from "components/card/Card";
import Debt from "../../debt/Debt";
import styles from "./DebtsIncluded.module.scss";
import Spinner from "components/placeholders/spinner/Spinner";

export default function DebtsIncluded({ debts }) {
	return (
		<Card dark title="Debts Included">
			<section className={styles.wrapper}>
				{!debts ? (
					<Spinner />
				) : (
					debts.map((debt) => {
						return (
							<Debt
								debt={debt}
								key={debt.id ? debt.id : debt._id}
								light
							/>
						);
					})
				)}
			</section>
		</Card>
	);
}
