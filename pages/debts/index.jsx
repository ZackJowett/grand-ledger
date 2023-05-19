import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Debts() {
	const { data: session } = useSession();

	// Get debts from database
	const [debts, setDebts] = useState(null);

	// Get all debts associated with logged in user
	useEffect(() => {
		if (!session) return;

		fetch(`/api/debts/${session.user.id}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setDebts(data.data);
				} else {
					console.log(data.message);
					alert(
						"Error fetching debts. Check console for details or contact admin."
					);
				}
			});
	}, [session]);

	// Not logged in
	if (!session) {
		return (
			<>
				<h1>Debts</h1>
				<p>You are not logged in</p>
				<button onClick={() => signIn()}>Sign in</button>
			</>
		);
	}

	// Logged in
	return (
		<>
			<h1>Debts</h1>
			<p>
				A debt is as amount of money someone owes you, or you owe
				someone
			</p>
			{session.user.username}
			<br />
			<Link href="/debts/create">New Debt</Link>
			{/* {debts ? JSON.stringify(debts) : <p>Loading...</p>} */}

			{debts ? (
				debts.map((debt, index) => {
					return (
						<div key={index}>
							<hr />
							<p>
								Creditor:{" "}
								{debt.creditor == session.user.id
									? "You"
									: debt.creditor}
							</p>
							<p>Debtor: {debt.debtor}</p>
							<p>Amount: {debt.amount.$numberDecimal}</p>
							<p>Description: {debt.description}</p>
							<p>Status: {debt.closed ? "Closed" : "Open"}</p>
							<p>Date Created: {debt.dateCreated}</p>
						</div>
					);
				})
			) : (
				<p>Loading...</p>
			)}
		</>
	);
}
