import Debt from "../../debt/Debt";
import styles from "./DebtsIncluded.module.scss";
import { CardPlaceholder } from "components/placeholders/Placeholders";
import Title from "components/text/title/TextWithTitle";
import { IconCheck, IconCross } from "components/icons";
import { useState } from "react";

export default function DebtsIncluded({
	debts,
	selectedDebts,
	setSelectedDebts,
}) {
	if (debts && debts.length <= 0) {
		return <section className={styles.wrapper}></section>;
	}

	console.log(selectedDebts);

	return (
		<section className={styles.wrapper}>
			<Title
				title="Debts Included"
				align="left"
				className={styles.title}
			/>
			{!debts ? (
				<>
					<CardPlaceholder />
					<CardPlaceholder />
					<CardPlaceholder />
				</>
			) : (
				debts.map((debt) => {
					return (
						<DebtSelector
							debt={debt}
							key={debt.id ? debt.id : debt._id}
							selectedDebts={selectedDebts}
							setSelectedDebts={setSelectedDebts}
						/>
					);
				})
			)}
		</section>
	);
}

function DebtSelector({ debt, selectedDebts, setSelectedDebts }) {
	const selected = selectedDebts
		? selectedDebts.find((selectedDebt) => selectedDebt._id === debt._id)
		: null;

	function handleSelect() {
		if (selected) {
			setSelectedDebts(
				selectedDebts.filter((selectedDebt) => {
					return selectedDebt._id !== debt._id;
				})
			);
		} else {
			setSelectedDebts([...selectedDebts, debt]);
		}
	}

	return (
		<div className={styles.debtWrapper}>
			<Debt debt={debt} light className={styles.debt} />
			<div
				className={`${styles.debtSelector} ${
					!selected ? styles.notSelected : ""
				}`}
				onClick={handleSelect}>
				{!selected ? <IconCross /> : <IconCheck />}
			</div>
		</div>
	);
}
