import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllUsers } from "/utils/data/users";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";

export default function Create() {
	const { data: session } = useSession();

	// States
	const [createAs, setCreateAs] = useState("creditor");
	const [users, setUsers] = useState(null);

	// User logged in
	// Get user options in same group
	useEffect(() => {
		if (!session) return;

		getAllUsers().then((data) => {
			data ? setUsers(data) : console.log("Error fetching data");
		});
	}, [session]);

	// User not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	// Create new debt
	const handleRegister = async (e) => {
		e.preventDefault();

		let creditor = session.user.id;
		let debtor = e.target.otherParty.value;

		if (createAs == "debtor") {
			creditor = e.target.otherParty.value;
			debtor = session.user.id;
			console.log("created as debtor");
		}

		const amount = e.target.amount.value;
		const description = e.target.description.value;

		const res = await fetch("/api/debts/newDebt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				creditor,
				debtor,
				amount,
				description,
				userId: session.user.id,
			}),
		});

		const data = await res.json();
		console.log(data);
	};

	const handleSelect = (e) => {
		setCreateAs(e.target.value);
	};

	return (
		<Layout>
			<h1>Create new debt</h1>

			<p>Create as: </p>
			<select name="creditor" id="creditor" onChange={handleSelect}>
				<option value="creditor">
					Creditor (someone owes you money)
				</option>
				<option value="debtor">Debtor (you owe money)</option>
			</select>

			<form onSubmit={handleRegister}>
				<label htmlFor="otherParty">
					{createAs == "creditor"
						? "Debtor (Who owes you money?)"
						: "Creditor (Who do you owe money to?)"}
				</label>
				<select name="otherParty" id="otherParty" disabled={!users}>
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

				<label htmlFor="password">amount</label>
				<input
					type="number"
					name="amount"
					id="amount"
					min="0"
					step=".01"
				/>

				<label htmlFor="Description">Description</label>
				<input
					type="textarea"
					name="description"
					id="description"
					required
				/>

				<button type="submit">Confirm New Debt</button>
			</form>
		</Layout>
	);
}
