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
	if (debts.data && debts.data.length <= 0) {
		return null;
	}

	return (
		<section className={styles.wrapper}>
			<Title
				title="Debts Included"
				text={
					netPosition && netPosition < 0 ? (
						<p className={styles.descriptor}>
							Click <IconCheck /> to exclude
						</p>
					) : null
				}
				align="left"
				className={styles.title}
			/>
			{debts.isLoading ? (
				<>
					<CardPlaceholder />
					<CardPlaceholder />
					<CardPlaceholder />
				</>
			) : debts.isError || !debts.data ? (
				<p>Error loading debts</p>
			) : (
				debts.data.map((debt, index) => {
					return (
						<DebtSelector
							debt={debt}
							key={index}
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
					return selectedDebt._id != debt._id;
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
				contentClassName={`${styles.debt} ${
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
