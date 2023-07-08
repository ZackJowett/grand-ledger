import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllBetweenTwoUsers } from "/utils/data/debts";
import styles from "public/styles/pages/CreateSettlement.module.scss";
import SelectUser from "components/settlement/create/form/SelectUser";
import SubmitSettlement from "components/settlement/create/form/SubmitSettlement";
import { createSettlement } from "utils/data/settlements";
import TextButton from "components/button/text/TextButton";
import NudgeButton from "components/button/nudge/NudgeButton";
import { useSelector } from "react-redux";

export default function CreateSettlement() {
	const { data: session, status: sessionStatus } = useSession();
	const state = useSelector((state) => state);
	const users = state.users.list;

	// States
	const [debts, setDebts] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(null);
	const [loading, setLoading] = useState(false); // String of loading state

	// Redux

	// Get all debts between two users
	useEffect(() => {
		if (sessionStatus !== "authenticated" || !state.users.ready) return;

		// Set default selected party that is not the user
		if (selectedUser == null) {
			if (users[0]._id != session.user.id) {
				setSelectedUser(users[0]);
			} else {
				setSelectedUser(users[1]);
			}
		}

		if (!selectedUser) return; // Verify selected party is set to a user

		setDebts(null); // Reset debts
		setLoading("Loading Debts...");

		// Fetch all closed debts between user and selected party
		// api endpoint with queries returns if user is creditor or debtor
		getAllBetweenTwoUsers(session.user.id, selectedUser._id, false).then(
			(data) => {
				// Return only outstanding debts
				data
					? setDebts(
							data.filter((debt) => {
								return debt.status == "outstanding";
							})
					  )
					: console.log("Error fetching data");
				setLoading(null);
			}
		);
	}, [sessionStatus, session, users, selectedUser]);

	// Get Totals
	// Is recalculated when useEffect changes (debts, selectedUser)
	let stats = { totalDebt: 0, totalUnreceived: 0, net: 0 };

	if (debts) {
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
				setDebts([]);
				setSubmitSuccess(data.data);
				setSubmitError(false);
				setLoading(null);
			}
		});
	}

	return (
		<>
			{submitError && (
				<p className={styles.error}>
					There was an error creating the settlement. Please try again
					or contact admin.
				</p>
			)}
			{submitSuccess && (
				<p className={styles.success}>
					Successfully created the settlement:{" "}
					<TextButton
						title="Click to view"
						link={`/settlements/${submitSuccess._id}`}
						className={styles.link}
					/>{" "}
				</p>
			)}
			<hr className={styles.hr} />
			<SelectUser
				debts={debts}
				selectedUser={selectedUser}
				setSelectedUser={setSelectedUser}
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
