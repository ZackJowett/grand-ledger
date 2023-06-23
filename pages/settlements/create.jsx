import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllBetweenTwoUsers } from "/utils/data/debts";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import styles from "public/styles/pages/CreateSettlement.module.scss";
import TextWithTitle from "/components/text/title/TextWithTitle";
import { useStore } from "react-redux";
import Spinner from "components/placeholders/spinner/Spinner";
import CurrentDebts from "components/settlement/create/CurrentDebts";
import SelectUser from "components/settlement/create/form/SelectUser";
import SubmitSettlement from "components/settlement/create/form/SubmitSettlement";
import Button from "components/button/Button";
import { createSettlement } from "../../utils/data/settlements";
import TextButton from "components/button/text/TextButton";

export default function Create() {
	const { data: session, status: sessionStatus } = useSession();

	// States
	const [createAs, setCreateAs] = useState("creditor");
	const [debts, setDebts] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(null);

	// Redux
	const state = useStore().getState();
	const users = state.userList.users;

	// Get all debts between two users
	useEffect(() => {
		if (sessionStatus !== "authenticated" || !users) return;

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
			}
		);
	}, [sessionStatus, session, users, selectedUser]);

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

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
		console.log("submitting");

		// Set submitting state
		setSubmitting(true);

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
		createSettlement(settlement).then((data) => {
			// Check if error
			if (!data.success) {
				// Error submitting
				setSubmitError(data.error);
				setSubmitSuccess(false);
				setSubmitting(false);
			} else {
				// Success submitting
				setDebts([]);
				setSubmitSuccess(data.data);
				setSubmitError(false);
				setSubmitting(false);

				console.log("Success submitting", data);
			}
		});
	}

	return (
		<Layout>
			<section className={styles.wrapper}>
				<TextWithTitle
					title={`Create Settlement`}
					text="Pay outstanding balances to someone"
					className={styles.header}
					align="left"
					large
				/>
				{submitError && (
					<p className={styles.error}>
						There was an error creating the settlement. Please try
						again or contact admin.
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

				{submitting ? (
					<Spinner title="Creating settlement..." />
				) : !debts ? (
					<Spinner title="Loading debts..." />
				) : (
					<>
						<p className={styles.desc}>
							1. Select someone to settle with
							<br />
							2. Check difference and if you need to pay them{" "}
							<br />
							3. Pay them the difference <br />
							4. Confirm
						</p>
						<CurrentDebts />
						<hr className={styles.hr} />
						<SelectUser
							users={users}
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
							<Button title="Nudge" />
						) : null}
					</>
				)}
			</section>
		</Layout>
	);
}
