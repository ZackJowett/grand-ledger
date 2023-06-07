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

export default function Create() {
	const { data: session } = useSession();

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
		if (!session || !users) return;

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
	}, [session, users, selectedUser]);

	// User not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	function handleSubmit(e) {
		e.preventDefault();
		console.log("submitting");
	}
	// Create new debt
	// const handleCreateSettlement = async (e) => {
	// 	e.preventDefault();

	// 	const settler = session.user.id;
	// 	const settlee = selectedUser._id;
	// 	const description = e.target.description.value;
	// 	const debtsToSettle = debts;
	// 	console.log(debts);

	// 	// Post data
	// 	await fetch("/api/settlements/create", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({
	// 			settler,
	// 			settlee,
	// 			description,
	// 			debts: debtsToSettle,
	// 			netAmount: netTotal,
	// 		}),
	// 	});
	// };

	const handleSelectUser = (e) => {
		let id = e.target.value;

		let user = users.find((user) => user._id == id);

		setSelectedUser(user);
	};

	// Get Totals
	// Is recalculated when useEffect changes (debts, selectedUser)
	let stats = { totalDebt: 0, totalUnreceived: 0, net: 0 };

	if (debts) {
		debts.forEach((debt) => {
			if (debt.creditor == session.user.id) {
				// User is creditor
				stats.totalUnreceived += debt.amount;
				stats.net -= debt.amount;
			} else {
				stats.totalDebt -= debt.amount;
				stats.net += debt.amount;
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
				<hr className={styles.hr} />

				{submitting ? (
					<Spinner title="Creating settlement..." />
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

				{/*  */}

				{/* <DebtList /> */}

				{/* <SubmitDebts /> */}
			</section>
			{/* <h1>Create new settlement</h1>

			{debts && debts.length == 0 ? (
				<>
					<p>
						You and {selectedUser.name} have no oustanding debts to
						each other. Well done!
					</p>
				</>
			) : (
				<>
					{selectedUser && (
						<>
							<>
								<h3>
									Total Debt (How much I owe{" "}
									{selectedUser.name}
									): ${totalDebt}
								</h3>
								<h3>
									Total Credit (How much {selectedUser.name}{" "}
									owes me): ${totalCredit}
								</h3>
								<h3>
									Total Payable (How much you I{" "}
									{selectedUser.name}
									): ${netTotal}
								</h3>
							</>
							<>
								{netTotal < 0 ? (
									<p>
										{selectedUser.name} owes you. Wait for
										them to pay you. Click here to nudge
										them.
									</p>
								) : netTotal == 0 ? (
									<p>
										The net total is exactly $0. Nice! You
										can continue to close this settlement
										without paying a cent.
									</p>
								) : (
									<p>
										You owe {selectedUser.name} ${netTotal}
										. You must pay them to settle your debt.
									</p>
								)}
							</>
						</>
					)}
				</>
			)}

			<form onSubmit={handleCreateSettlement}>
				<label htmlFor="otherParty">
					Creditor (who do you want settle your debt with?):{" "}
				</label>
				<select
					name="otherParty"
					id="otherParty"
					disabled={!users}
					onChange={handleSelectParty}>
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

				{netTotal >= 0 && debts && debts.length > 0 && (
					<>
						<label htmlFor="Description">Description</label>
						<input
							type="textarea"
							name="description"
							id="description"
							required
						/>

						<button type="submit">Continue to Confirmation</button>
					</>
				)}
			</form>

			{debts && debts.length > 0 && (
				<div>
					<p>Debts included in this settlement</p>
					{debts ? (
						debts.map((debt, index) => {
							return (
								<div key={index}>
									<hr />
									<p>
										Creditor:{" "}
										{getName(debt.creditor, users, session)}
									</p>
									<p>
										Debtor:{" "}
										{getName(debt.debtor, users, session)}
									</p>
									<p>Amount: ${debt.amount} AUD</p>
									<p>Description: {debt.description}</p>
									<p>
										Status:{" "}
										{debt.closed ? "Closed" : "Open"}
									</p>
									<p>
										Date Created:{" "}
										{formatDate(debt.dateCreated)}
									</p>
								</div>
							);
						})
					) : (
						<p>Loading...</p>
					)}
				</div>
			)} */}
		</Layout>
	);
}
