import SingularDebt from "./types/SingularDebt";
import MultiDebt from "./types/MultiDebt";
import styles from "./DebtList.module.scss";

export default function DebtList({ debts, setDebts }) {
	function removeDebt(id) {
		setDebts(
			debts.filter((debt) => {
				return debt.id !== id;
			})
		); // Set debts state
	}

	return (
		<section className={styles.wrapper}>
			{debts.map((debt, index) => {
				if (debt.type === "single") {
					return (
						<SingularDebt
							key={debt.id}
							debt={debt}
							debts={debts}
							setDebts={setDebts}
							removeDebt={removeDebt}
							className={styles.single}
						/>
					);
				} else if (debt.type === "multi") {
					return (
						<MultiDebt
							key={debt.id}
							debt={debt}
							debts={debts}
							setDebts={setDebts}
							removeDebt={removeDebt}
							className={styles.multi}
						/>
					);
				}
			})}
		</section>
	);
}
