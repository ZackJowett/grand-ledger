import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, getName } from "/utils/helpers";
import { getAllForCreditor } from "/utils/data/debts";
import { getAllUsers } from "/utils/data/users";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";

export default function UnreceivedPayments() {
	const { data: session } = useSession();

	// Get debts from database
	const [debts, setDebts] = useState(null);
	const [users, setUsers] = useState(null);
	const [totalUnreceived, setTotalUnreceived] = useState(null);

	// Get all debts associated with logged in user
	useEffect(() => {
		if (!session) return;

		getAllForCreditor(session.user.id).then((data) => {
			data ? setDebts(data) : console.log("Error fetching data");
		});

		getAllUsers().then((data) => {
			data ? setUsers(data) : console.log("Error fetching data");
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
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	// Logged in
	return (
		<Layout>
			<h1>Unreceived Payments</h1>
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
					if (debt.closed) return null;

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
		</Layout>
	);
}
