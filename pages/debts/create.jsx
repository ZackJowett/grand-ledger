import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Create() {
	const { data: session } = useSession();

	// States
	const [createAs, setCreateAs] = useState("creditor");
	const [users, setUsers] = useState(null);

	// User not logged in
	// if (!session) {
	// 	return (
	// 		<>
	// 			<h1>Debts</h1>
	// 			<p>You are not logged in</p>
	// 			<button onClick={() => signIn()}>Sign in</button>
	// 		</>
	// 	);
	// }

	// User logged in
	// Get user options in same group
	useEffect(() => {
		if (!session) return;

		fetch(`/api/users`)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					console.log(data.data);
					setUsers(data.data);
				} else {
					console.log(data.message);
					alert(
						"Error fetching users. Check console for details or contact admin."
					);
				}
			});
	}, [session]);

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
		<>
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
		</>
	);
}
