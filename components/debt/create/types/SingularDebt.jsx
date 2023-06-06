import Card from "components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./SingularDebt.module.scss";
import { RxCross2 } from "react-icons/rx";
import { useStore } from "react-redux";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SingularDebt({ debt, debts, setDebts, removeDebt }) {
	const { data: session } = useSession();
	const state = useStore().getState();
	const users = state.userList.users;

	const [amount, setAmount] = useState(debt.amount);

	useEffect(() => {
		// Update amount when it is edited
		setDebts(
			debts.filter((currentDebt) => {
				if (currentDebt.id === debt.id) {
					currentDebt.amount = Number(amount);
					return currentDebt;
				}
				return currentDebt;
			})
		);
	}, [amount, debt]);

	function updateCreateAs(e) {
		setDebts(
			debts.filter((currentDebt) => {
				if (currentDebt.id === debt.id) {
					currentDebt.createAs = e.target.value;
					return currentDebt;
				}
				return currentDebt;
			})
		); // Set debts state
	}

	function updateOtherParty(e) {
		setDebts(
			debts.filter((currentDebt) => {
				if (currentDebt.id === debt.id) {
					currentDebt.otherParty = e.target.value;
					return currentDebt;
				}
				return currentDebt;
			})
		); // Set debts state
	}

	function updateAmount(e) {
		// Set amount of debt
		let amount = Number(e.target.value);

		// Limit to only two decimal places
		if (amount.countDecimals() > 2) {
			amount = amount.toFixed(2);
		}

		// Set amount state - useEffect will then update the debt amount
		setAmount(amount);
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

	return (
		<Card dark>
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
						<select
							name="createAs"
							id="createAs"
							onChange={updateCreateAs}>
							<option value="creditor">Creditor</option>
							<option value="debtor">Debtor</option>
						</select>
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
					<select
						name="otherParty"
						id="otherParty"
						disabled={!users}
						onChange={updateOtherParty}>
						{users ? (
							users.map((user, index) => {
								if (user._id != session.user.id)
									return (
										<option value={user._id} key={index}>
											{user.name}
										</option>
									);
							})
						) : (
							<option>Loading...</option>
						)}
					</select>
				</div>

				{/* Amount */}
				<div className={styles.inputSection}>
					<TextWithTitle title="Amount" align="left" small />
					<div className={styles.amountInput}>
						$
						<input
							type="number"
							name="amount"
							id="amount"
							min="0"
							step=".01"
							placeholder="0.00"
							className={styles.amount}
							value={amount > 0 ? amount : ""}
							onChange={updateAmount}
						/>
						AUD
					</div>
				</div>

				{/* Description */}
				<div className={styles.inputSection}>
					<TextWithTitle title="Description" align="left" small />
					<input
						type="text"
						placeholder="This is for..."
						onChange={(e) => updateDescription(e)}
					/>
				</div>
			</section>
		</Card>
	);
}
