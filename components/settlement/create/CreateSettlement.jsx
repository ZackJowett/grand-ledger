import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SelectUser from "components/settlement/create/form/SelectUser";
import SubmitSettlement from "components/settlement/create/form/SubmitSettlement";
import { createSettlement } from "utils/data/settlements";
import NudgeButton from "components/button/nudge/NudgeButton";
import DebtsIncluded from "components/settlement/create/DebtsIncluded";
import { useDebtsBetweenUsersOutstanding } from "utils/hooks";
import Card from "components/card/Card";
import Title from "components/text/title/TextWithTitle";
import Spinner from "components/placeholders/spinner/Spinner";
import styles from "./CreateSettlement.module.scss";
import Settlement from "components/settlement/Settlement";
import Button from "components/button/Button";
import { useRouter } from "next/router";

export default function CreateSettlement() {
	const { data: session, status: sessionStatus } = useSession();

	// States
	const [selectedUser, setSelectedUser] = useState(null);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(null);
	const [loading, setLoading] = useState(false);
	const [settlement, setSettlement] = useState(null); // Settlement object

	const {
		data: debts,
		isLoading: debtsLoading,
		error: debtsError,
	} = useDebtsBetweenUsersOutstanding(session.user.id, selectedUser?._id);

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
		setLoading(true);

		// get debt ids
		const debtIds = selectedDebts.map((debt) => {
			return debt._id;
		});

		console.log(debtIds);

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
				setSubmitSuccess(null);
				setLoading(false);
			} else {
				// Success submitting
				setSubmitError(null);
				setSubmitSuccess(data.data);
				setLoading(false);
			}
		});
	}

	return (
		<>
			<SubmissionStatus
				loading={loading}
				success={submitSuccess}
				error={submitError}
				user={selectedUser}
			/>
			{!loading && !submitSuccess && !submitError && (
				<>
					<SelectUser
						debts={debts}
						selectedUser={selectedUser}
						setSelectedUser={setSelectedUser}
						selectedDebts={selectedDebts}
						setSelectedDebts={setSelectedDebts}
						stats={stats}
						submitSuccess={submitSuccess}
					/>

					{stats.net < 0 ? (
						<SubmitSettlement
							selectedUser={selectedUser}
							handleSubmit={handleSubmit}
							stats={stats}
							debtsIncluded={selectedDebts}
							totalNumDebts={debts ? debts.length : null}
						/>
					) : stats.net > 0 ? (
						<>
							<p>
								{selectedUser.name} owes you more and must
								create the Settlement
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
			)}
		</>
	);
}

function SubmissionStatus({ loading, success, error, user }) {
	const router = useRouter();
	if (success) {
		return (
			<Card>
				<div className={styles.error}>
					<Title
						title="Success!"
						align="left"
						className={styles.title}
					/>
					<p className={styles.desc}>
						Successfully created a settlement with{" "}
						{user ? user.name : "--"}
					</p>
					<Settlement
						settlement={success}
						className={styles.settlement}
						light
					/>
				</div>
				<Button
					title="New Settlement"
					className={styles.button}
					onClick={() => router.reload()}
				/>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className={styles.errorCard}>
				<div className={styles.error}>
					<Title
						title="Error Creating Settlement"
						align="left"
						className={styles.title}
					/>
					<p className={styles.desc}>
						There was an error creating a settlement with{" "}
						{user ? user.name : "--"}
					</p>
					<p className={styles.tryAgain}>Please try again</p>
				</div>
			</Card>
		);
	}

	if (loading) {
		return (
			<Card>
				<div className={styles.loading}>
					<Title
						title="Submitting Settlement..."
						align="left"
						className={styles.title}
					/>
					<Spinner className={styles.spinner} />
				</div>
			</Card>
		);
	}
}
