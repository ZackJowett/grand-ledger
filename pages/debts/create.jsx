import { signIn, useSession } from "next-auth/react";

export default function Create() {
	const { data: session } = useSession();

	// User not logged in
	if (!session) {
		return (
			<>
				<h1>Debts</h1>
				<p>You are not logged in</p>
				<button onClick={() => signIn()}>Sign in</button>
			</>
		);
	}

	// User logged in

	// Create new debt
	const handleRegister = async (e) => {
		e.preventDefault();
		const creditor = session.user.username;
		const debtor = e.target.debtor.value;
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

	return (
		<>
			<h1>Create new debt</h1>
			<form onSubmit={handleRegister}>
				<label htmlFor="debtor">Debtor (Who owes you money)</label>
				<input type="text" name="debtor" id="debtor" />

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
