import SingularDebt from "./types/SingularDebt";
import { useEffect, useState } from "react";

export default function DebtList({ debts, setDebts }) {
	return debts.map((debt, index) => {
		return (
			<SingularDebt
				key={index}
				debts={debts}
				index={index}
				setDebts={setDebts}
			/>
		);
	});
}
