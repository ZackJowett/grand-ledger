import Card from "components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./MultiDebt.module.scss";
import { RxCross2 } from "react-icons/rx";
import { useStore } from "react-redux";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { get } from "http";
import SelectUser from "./SelectUser";
import { distributeAmount } from "utils/helpers";
import Toggle from "components/button/toggle/Toggle";
import { useUsers } from "utils/hooks";

Number.prototype.countDecimals = function () {
	if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
	return this.toString().split(".")[1].length || 0;
};

export default function MultiDebt({
	debt,
	debts,
	setDebts,
	removeDebt,
	className,
}) {
	const { data: session } = useSession();
	const {
		data: users,
		isLoading: usersLoading,
		isError: usersError,
	} = useUsers();

	const [usersSelected, setUsersSelected] = useState(debt.parties);
	const [editingUser, setEditingUser] = useState(null);
	const [splitEvenly, setSplitEvenly] = useState(true);
	const [total, setTotal] = useState(debt.total);

	useEffect(() => {
		// Update total when it is edited
		setDebts(
			debts.filter((currentDebt) => {
				if (currentDebt.id === debt.id) {
					currentDebt.total = Number(total);

					return currentDebt;
				}
				return currentDebt;
			})
		);

		recalculateAmounts();
	}, [total, debt]);

	useEffect(() => {
		// Update parties when usersSelected is updated
		console.log(`ID: ${debt.id}`);
		setDebts(
			debts.filter((currentDebt) => {
				if (currentDebt.id === debt.id) {
					currentDebt.parties = usersSelected;
					console.log(`CHANGED SOMETHING FOR ${debt.id}`);

					return currentDebt;
				}
				return currentDebt;
			})
		);

		console.log(debts);
	}, [usersSelected]);

	// Select user will add a user to the usersSelected array when their
	// checkbox is selected
	// Automatically adjust amounts between totals when a user is added
	function handleSelectUser(e, debtId) {
		if (e.target.checked) {
			const amountSum = usersSelected.reduce((acc, user) => {
				return acc + user.amount;
			}, 0);
			console.log(`Selected user in debt ${debt.id}`);

			if (amountSum == debt.total) {
				// Amount is equal to total
				if (splitEvenly) {
					// Split debt evenly between all users
					const evenAmount = distributeAmount(
						debt.total,
						usersSelected.length + 1
					); // array of amounts that are evenly distributed

					// Update all existing users with even amount
					const updatedUsers = usersSelected.map((user, index) => {
						return {
							...user,
							amount: evenAmount[index],
						};
					});

					// Add new user with even amount
					setUsersSelected([
						...updatedUsers,
						{
							id: e.target.value,
							amount: evenAmount[evenAmount.length - 1],
						},
					]);
				} else {
					// Option 2
					// Add user with 0 amount
					setUsersSelected([
						...usersSelected,
						{
							id: e.target.value,
							amount: 0,
						},
					]);
				}
			} else if (amountSum < debt.total) {
				// Total amount is less than total, add user with remaining amount
				setUsersSelected([
					...usersSelected,
					{
						id: e.target.value,
						amount: debt.total - amountSum,
					},
				]);
			} else {
				// Total amount is greater than total, add user with 0 amount
				setUsersSelected([
					...usersSelected,
					{
						id: e.target.value,
						amount: 0,
					},
				]);
			}
		} else {
			// USER IS BEING UNCHECKED
			// If split evenly, recalculate amounts
			if (splitEvenly) {
				// Divide amounts between remaining users
				const evenAmount = distributeAmount(
					debt.total,
					usersSelected.length - 1
				);

				// Update all existing users with even amount and remove user
				const updatedUsers = usersSelected.filter((user, index) => {
					return user.id != e.target.value;
				});

				const updatedUsers2 = updatedUsers.map((user, index) => {
					return {
						...user,
						amount: evenAmount[index],
					};
				});
				setUsersSelected(updatedUsers2);
			} else {
				// Divide amounts between remaining users
				// Remove user from usersSelected and split ratio evenly between remaining users
				let userAmount = 0;

				// Get user amount to divide and remove from usersSelected array
				const updatedUsers = usersSelected.filter((user) => {
					if (user.id == e.target.value) {
						userAmount = user.amount;
						return false;
					}
					return true;
				});

				// Calculate perfect division of userAmount between remaining users
				let dividedAmount = distributeAmount(
					userAmount,
					updatedUsers.length
				);

				const updatedUsers2 = updatedUsers.map((user, index) => {
					return {
						...user,
						amount: user.amount + dividedAmount[index],
					};
				});
				setUsersSelected(updatedUsers2);
			}
		}
	}

	function handleSetTotal(e) {
		// Set total amount of debt
		let amount = Number(e.target.value);

		// Limit to only two decimal places
		if (amount.countDecimals() > 2) {
			amount = amount.toFixed(2);
		}

		setTotal(amount);
	}

	function userIsSelected(id) {
		return usersSelected.find((user) => user.id === id);
	}

	function recalculateTotal() {
		// Individual user amounts have been edited
		// Disabled split evenly
		setSplitEvenly(false);

		// Recalculate total amount of debt based on usersSelected
		const amountSum = usersSelected.reduce((acc, user) => {
			return acc + user.amount;
		}, 0);

		// Set debt.total to amountSum
		setTotal(amountSum.toFixed(2));
	}

	function recalculateAmounts() {
		// Recalculate amounts based on total
		if (splitEvenly) {
			// Split total evenly between usersSelected
			const evenAmount = distributeAmount(
				debt.total,
				usersSelected.length
			);
			setUsersSelected(
				usersSelected.map((user, index) => {
					return {
						...user,
						amount: evenAmount[index],
					};
				})
			);
		}
	}

	function handleSplitEvenly() {
		// Disabled split evenly
		if (splitEvenly) {
			setSplitEvenly(false);
			return;
		}

		// Enable and perform split evenly
		setSplitEvenly(true);

		// If no users selected, return
		if (usersSelected.length < 1) return;

		// Split total evenly between usersSelected
		const evenAmount = distributeAmount(debt.total, usersSelected.length);
		console.log(debt.total, evenAmount);
		setUsersSelected(
			usersSelected.map((user, index) => {
				return {
					...user,
					amount: evenAmount[index],
				};
			})
		);
	}

	// Check if total amount of usersSelected is equal to debt.total
	function totalMatchesSum() {
		if (usersSelected.length < 1) return true;
		if (splitEvenly) return true; // If split evenly, total will always match sum

		const amountSum = usersSelected
			.reduce((acc, user) => {
				return acc + user.amount;
			}, 0)
			.toFixed(2);

		console.log(`${amountSum} vs ${total}`);

		return amountSum == total;
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
		<Card dark className={className ? className : ""}>
			<section className={styles.wrapper}>
				{/* Header */}
				<div className={styles.headerWrapper}>
					<div className={styles.header}>
						<TextWithTitle title="Multi Debt" align="left" />
						<RxCross2
							className={styles.exitCross}
							onClick={() => {
								removeDebt(debt.id);
							}}
						/>
					</div>
					<TextWithTitle
						text="Automatically split an amount between multiple people"
						align="left"
					/>
				</div>

				{/* Amount */}
				<div className={styles.inputSection}>
					<TextWithTitle title="Total Amount" align="left" small />
					<div className={styles.total}>
						<div className={styles.totalInput}>
							$
							<input
								type="number"
								name="amount"
								id="amount"
								min="0"
								step=".01"
								placeholder="0.00"
								value={total > 0 ? total : ""}
								onChange={handleSetTotal}
							/>
							AUD
						</div>
						<Toggle
							title={"Split Evenly"}
							active={splitEvenly}
							onClick={handleSplitEvenly}
							className={styles.splitEvenly}
						/>
					</div>

					{!totalMatchesSum() && (
						<p className={styles.warning}>
							Total doesn&apos;t add up with the individual
							amounts. Only individual amounts will be saved.
						</p>
					)}
				</div>

				{/* Parties */}
				<div className={styles.inputSection}>
					<div className={styles.inputHeader}>
						<TextWithTitle
							title="Select people to include"
							align="left"
							small
						/>
					</div>
					<div className={styles.parties} key={debt.id}>
						{/* Current User */}
						<SelectUser
							key={`${debt._id}-${session.user.id}`}
							id={`${debt._id}-${session.user.id}`}
							user={
								!usersLoading && users
									? users.find(
											(user) =>
												user._id === session.user.id
									  )
									: null
							}
							debt={debt}
							total={total}
							userSelected={userIsSelected(session.user.id)}
							handleSelectUser={handleSelectUser}
							editingUser={editingUser}
							setEditingUser={setEditingUser}
							recalculateTotal={recalculateTotal}
						/>

						{!usersLoading && users
							? users.map((user, index) => {
									if (user._id === session.user.id) return; // Don't show current user
									return (
										<SelectUser
											key={`${debt._id}-${index}`}
											id={`${debt._id}-${index}`}
											user={user}
											debt={debt}
											total={total}
											userSelected={userIsSelected(
												user._id
											)}
											handleSelectUser={handleSelectUser}
											editingUser={editingUser}
											setEditingUser={setEditingUser}
											recalculateTotal={recalculateTotal}
										/>
									);
							  })
							: null}
					</div>
					<TextWithTitle
						text="Hint: Click amounts to edit"
						align="right"
						className={styles.hint}
						tiny
					/>
				</div>

				{/* Description */}
				<div className={styles.inputSection}>
					<TextWithTitle title="Description" align="left" small />
					<input
						type="text"
						placeholder="This is for..."
						onChange={updateDescription}
					/>
				</div>

				<TextWithTitle
					title={`This will create *${usersSelected.length}* ${
						usersSelected.length == 0
							? "debts."
							: usersSelected.length == 1
							? "debt, between you and the selected person"
							: "debts. Each one will be between you and the selected person"
					}`}
					align="center"
					className={styles.bottomText}
					tiny
				/>
			</section>
		</Card>
	);
}
