import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SelectUser from "components/settlement/create/form/SelectUser";
import SubmitSettlement from "components/settlement/create/form/SubmitSettlement";
import { createSettlement } from "utils/data/settlements";
import NudgeButton from "components/button/nudge/NudgeButton";
import DebtsIncluded from "components/settlement/create/DebtsIncluded";
import { useDebtsBetweenUsers } from "utils/hooks";

export default function CreateSettlement() {
	const { data: session, status: sessionStatus } = useSession();

	// States
	const [selectedUser, setSelectedUser] = useState(null);
	// const [submitError, setSubmitError] = useState(null);
	// const [submitSuccess, setSubmitSuccess] = useState(null);
	// const [loading, setLoading] = useState(false); // String of loading state

	const {
		data: debts,
		isLoading: debtsLoading,
		error: debtsError,
	} = useDebtsBetweenUsers(session.user.id, selectedUser?._id);

	const [selectedDebts, setSelectedDebts] = useState(debts);

	// Get Totals
	// Is recalculated when useEffect changes (debts, selectedUser)
	let stats = { totalDebt: 0, totalUnreceived: 0, net: 0 };

	if (debts) {
		if (selectedDebts === null) setSelectedDebts(debts);
		debts.forEach((debt) => {
			if (debt.creditor == session.user.id) {
				// User is creditor
				stats.totalUnreceived += debt.amount;
				stats.net += debt.amount;
			} else {
				stats.totalDebt -= debt.amount;
				stats.net -= debt.amount;
			}
		});
	}

	useEffect(() => {
		setSelectedDebts(debts);
	}, [selectedUser, debts]);

	// Create new debt
	function handleSubmit(description) {
		// Set submitting state
		setLoading("Creating Settlement...");

		// get debt ids
		const debtIds = debts.map((debt) => {
			return debt._id;
		});

		// Create settlement object
		const settlement = {
			settler: session.user.id,
			settlee: selectedUser._id,
			debts: debtIds,
			netAmount: stats.net,
			description: description,
		};

		// Post data
		createSettlement(settlement, session.user.id).then((data) => {
			// Check if error
			if (!data.success) {
				// Error submitting
				setSubmitError(data.error);
				setSubmitSuccess(false);
				setLoading(null);
			} else {
				// Success submitting
				// setDebts([]);
				setSubmitSuccess(data.data);
				setSubmitError(false);
				setLoading(null);
			}
		});
	}

	return (
		<>
			<SelectUser
				debts={debts}
				selectedUser={selectedUser}
				setSelectedUser={setSelectedUser}
				selectedDebts={selectedDebts}
				setSelectedDebts={setSelectedDebts}
				stats={stats}
			/>

			{stats.net < 0 ? (
				<SubmitSettlement
					selectedUser={selectedUser}
					handleSubmit={handleSubmit}
					stats={stats}
				/>
			) : stats.net > 0 ? (
				<>
					<p>
						Person in greater debt ({selectedUser.name}) must create
						the settlement
					</p>
					<NudgeButton
						user={selectedUser._id}
						name={selectedUser.name}
					/>
				</>
			) : (
				<p>No action needed</p>
			)}
		</>
	);
}
