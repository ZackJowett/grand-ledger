import Card from "components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./SingularDebt.module.scss";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select from "components/forms/Select";
import { InputNumber, InputText } from "components/forms/Input";
import { useSelectedGroup, useGroupUsers } from "utils/hooks";

export default function SingularDebt({
	debt,
	debts,
	setDebts,
	removeDebt,
	className,
}) {
	const { data: session } = useSession();
	const group = useSelectedGroup(session.user.id);
	const users = useGroupUsers(group.exists ? group.data._id : null);
	const [amount, setAmount] = useState({ id: debt.id, value: debt.amount });

	useEffect(() => {
		// Update amount when it is edited
		setDebts(
			debts.filter((currentDebt) => {
				if (currentDebt.id === debt.id) {
					currentDebt.amount = Number(amount.value);
					return currentDebt;
				}
				return currentDebt;
			})
		);
		console.log(amount);
	}, [amount, debt]);

	function updateCreateAs(option) {
		setDebts(
			debts.filter((currentDebt) => {
				if (currentDebt.id === debt.id) {
					currentDebt.createAs = option.value;
					return currentDebt;
				}
				return currentDebt;
			})
		); // Set debts state
	}

	function updateOtherParty(option) {
		setDebts(
			debts.filter((currentDebt) => {
				if (currentDebt.id === debt.id) {
					currentDebt.otherParty = option.value;
					return currentDebt;
				}
				return currentDebt;
			})
		); // Set debts state
	}

	function updateAmount(e) {
		// Set amount of debt
		let newAmount = Number(e.target.value);

		// Limit to only two decimal places
		if (newAmount.countDecimals() > 2) {
			newAmount = newAmount.toFixed(2);
		}

		// Set amount state - useEffect will then update the debt amount
		setAmount({ ...amount, value: newAmount });
	}

	function updateDescription(e) {
		setDebts(
			debts.filter((currentDebt) => {
				if (currentDebt.id === debt.id) {
					currentDebt.description = e.target.value;
					return currentDebt;
				}
				return currentDebt;
			})
		); // Set debts state
	}

	const optionCreateAs = [
		{ value: "creditor", label: "Creditor" },
		{ value: "debtor", label: "Debtor" },
	];

	let optionOtherParty = null;

	if (users.exists) {
		optionOtherParty = users.data
			.map((user) => {
				if (user._id === session.user.id) return;
				return { value: user._id, label: user.name };
			})
			.filter((item) => item);
	} else {
		optionOtherParty = null;
	}

	return (
		<Card dark className={className ? className : ""}>
			<section className={styles.wrapper}>
				{/* Header */}
				<div className={styles.headerWrapper}>
					<div className={styles.header}>
						<TextWithTitle title="Singular Debt" align="left" />
						<RxCross2
							className={styles.exitCross}
							onClick={() => {
								console.log(`removing id: ${debt.id}`);
								removeDebt(debt.id);
							}}
						/>
					</div>
					<TextWithTitle
						text="Created between you and one other person"
						align="left"
					/>
				</div>

				{/* Create as */}
				<div className={styles.inputSection}>
					<TextWithTitle title="Create as" align="left" small />
					<div className={styles.createAs}>
						<Select
							options={optionCreateAs}
							defaultValue={optionCreateAs[0]}
							className={styles.select}
							onChange={updateCreateAs}
						/>
						<p>
							{debt.createAs == "creditor"
								? "(Someone owes you money)"
								: "(You owe someone money)"}
						</p>
					</div>
				</div>

				{/* Other party */}
				<div className={styles.inputSection}>
					<TextWithTitle title="With" align="left" small />
					{users.isLoading ? (
						<p>Loading...</p>
					) : users.isError ? (
						<p>Failed to load users</p>
					) : users.exists && optionOtherParty.length > 0 ? (
						<>
							{console.log(optionOtherParty)}
							<Select
								options={optionOtherParty}
								defaultValue={optionOtherParty[0]}
								className={styles.select}
								onChange={updateOtherParty}
							/>
						</>
					) : (
						<p>You are the only member of this group</p>
					)}
				</div>

				{/* Amount */}
				<div className={styles.inputSection}>
					<TextWithTitle title="Amount" align="left" small />
					<div className={styles.amountInput}>
						$
						<InputNumber
							type="number"
							name="amount"
							id="amount"
							min="0"
							step=".01"
							placeholder="0.00"
							value={amount.value > 0 ? amount.value : ""}
							onChange={updateAmount}
						/>
						AUD
					</div>
				</div>

				{/* Description */}
				<div className={styles.inputSection}>
					<TextWithTitle title="Description" align="left" small />
					<InputText
						placeholder="This is for..."
						onChange={(e) => updateDescription(e)}
					/>
				</div>
			</section>
		</Card>
	);
}
