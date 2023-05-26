import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatDate, getName } from "/utils/helpers";
import { getAllUsers } from "/utils/data/users";
import { getAllBetweenTwoUsers } from "/utils/data/debts";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";

export default function Create() {
	const { data: session } = useSession();

	// States
	const [createAs, setCreateAs] = useState("creditor");
	const [users, setUsers] = useState(null);
	const [debts, setDebts] = useState(null);
	const [selectedParty, setSelectedParty] = useState(null);

	// User logged in
	// Get user options in same group
	useEffect(() => {
		if (!session) return;

		getAllUsers().then((data) => {
			data ? setUsers(data) : console.log("Error fetching data");
		});
	}, [session]);

	useEffect(() => {
		if (!session || !users) return;

		// Set default selected party that is not the user
		if (selectedParty == null) {
			if (users[0]._id != session.user.id) {
				setSelectedParty(users[0]);
			} else {
				setSelectedParty(users[1]);
			}
		}

		if (!selectedParty) return; // Verify selected party is set to a user

		// Fetch all closed debts between user and selected party
		// api endpoint with queries returns if user is creditor or debtor
		getAllBetweenTwoUsers(session.user.id, selectedParty._id, false).then(
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
	}, [session, users, selectedParty]);

	// User not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	// Create new debt
	const handleCreateSettlement = async (e) => {
		e.preventDefault();

		const settler = session.user.id;
		const settlee = selectedParty._id;
		const description = e.target.description.value;
		const debtsToSettle = debts;
		console.log(debts);

		// Post data
		await fetch("/api/settlements/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				settler,
				settlee,
				description,
				debts: debtsToSettle,
				netAmount: netTotal,
			}),
		});
	};

	const handleSelectParty = (e) => {
		let id = e.target.value;

		let user = users.find((user) => user._id == id);

		setSelectedParty(user);
	};

	// Get Totals
	let totalDebt = 0;
	let totalCredit = 0;
	let netTotal = 0;

	if (debts) {
		debts.forEach((debt) => {
			if (debt.creditor == session.user.id) {
				totalCredit += debt.amount;
				netTotal -= debt.amount;
			} else {
				totalDebt += debt.amount;
				netTotal += debt.amount;
			}
		});
	}

	return (
		<Layout>
			<h1>Create new settlement</h1>

			{debts && debts.length == 0 ? (
				<>
					<p>
						You and {selectedParty.name} have no oustanding debts to
						each other. Well done!
					</p>
				</>
			) : (
				<>
					{selectedParty && (
						<>
							<>
								<h3>
									Total Debt (How much I owe{" "}
									{selectedParty.name}
									): ${totalDebt}
								</h3>
								<h3>
									Total Credit (How much {selectedParty.name}{" "}
									owes me): ${totalCredit}
								</h3>
								<h3>
									Total Payable (How much you I{" "}
									{selectedParty.name}
									): ${netTotal}
								</h3>
							</>
							<>
								{netTotal < 0 ? (
									<p>
										{selectedParty.name} owes you. Wait for
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
										You owe {selectedParty.name} ${netTotal}
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
			)}
		</Layout>
	);
}
