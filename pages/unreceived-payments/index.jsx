import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, getName } from "/utils/helpers";

export default function UnreceivedPayments() {
	const { data: session } = useSession();

	// Get debts from database
	const [debts, setDebts] = useState(null);
	const [users, setUsers] = useState(null);
	const [totalUnreceived, setTotalUnreceived] = useState(null);

	// Get all debts associated with logged in user
	useEffect(() => {
		if (!session) return;

		fetch(`/api/debts?creditor=${session.user.id}`)
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

		fetch("/api/users")
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setUsers(data.data);
				} else {
					console.log(data.message);
					alert(
						"Error fetching users. Check console for details or contact admin."
					);
				}
			});
	}, [session]);

	useEffect(() => {
		if (!debts) return;

		let total = 0;

		// Get total amount unreceived
		debts.forEach((debt) => {
			if (!debt.closed) {
				total += debt.amount;
				console.log(total);
			}
		});

		setTotalUnreceived(total.toFixed(2));
	}, [debts]);

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
			<h1>Unreceived Payments</h1>
			<Link href="/">Home</Link>
			<p>
				An <strong>unreceived payment</strong> is an debt someone has to
				you and is how much they owe you
			</p>
			<p>These have not yet been closed</p>
			<h3>
				Total Amount:{" $"}
				{totalUnreceived !== null ? totalUnreceived : "Calculating..."}
			</h3>

			{debts ? (
				debts.map((debt, index) => {
					// Filter debts

					return (
						<div key={index}>
							<hr />
							<p>
								Creditor:{" "}
								{getName(debt.creditor, users, session)}
							</p>
							<p>
								Debtor: {getName(debt.debtor, users, session)}
							</p>
							<p>Amount: ${debt.amount} AUD</p>
							<p>Description: {debt.description}</p>
							<p>Status: {debt.closed ? "Closed" : "Open"}</p>
							<p>Date Created: {formatDate(debt.dateCreated)}</p>
						</div>
					);
				})
			) : (
				<p>Loading...</p>
			)}
		</>
	);
}
