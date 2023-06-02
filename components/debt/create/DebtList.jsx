import SingularDebt from "./types/SingularDebt";
import MultiDebt from "./types/MultiDebt";

export default function DebtList({ debts, setDebts }) {
	function removeDebt(id) {
		setDebts(
			debts.filter((debt) => {
				return debt.id !== id;
			})
		); // Set debts state
	}

	return debts.map((debt) => {
		if (debt.type === "single") {
			return (
				<SingularDebt
					key={debt.id}
					debt={debt}
					debts={debts}
					setDebts={setDebts}
					removeDebt={removeDebt}
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
				/>
			);
		}
	});
}
