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
	netPosition,
}) {
	if (debts && debts.length <= 0) {
		return null;
	}

	return (
		<section className={styles.wrapper}>
			<Title
				title="Debts Included"
				text={
					netPosition &&
					netPosition < 0 && (
						<p className={styles.descriptor}>
							Click <IconCheck /> to exclude
						</p>
					)
				}
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
							netPosition={netPosition}
						/>
					);
				})
			)}
		</section>
	);
}

function DebtSelector({ debt, selectedDebts, setSelectedDebts, netPosition }) {
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
			<Debt
				debt={debt}
				light
				className={`${styles.debt} ${
					netPosition && netPosition < 0
						? styles.debtRoundCorners
						: ""
				}`}
			/>

			{netPosition && netPosition < 0 && (
				<div
					className={`${styles.debtSelector} ${
						!selected ? styles.notSelected : ""
					}`}
					onClick={handleSelect}>
					{!selected ? <IconCross /> : <IconCheck />}
				</div>
			)}
		</div>
	);
}
