import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Debts() {
	const { data: session } = useSession();

	// Get debts from database
	const [debts, setDebts] = useState(null);
	// const [openDebts, setOpenDebts] = useState(null); // debts.filter(debt => !debt.closed)
	// const [closedDebts, setClosedDebts] = useState(null);
	const [users, setUsers] = useState(null);
	const [filter, setFilter] = useState("open"); // "all" || "open" || "closed"
	const [totalUnreceived, setTotalUnreceived] = useState(null);

	// Get all debts associated with logged in user
	useEffect(() => {
		if (!session) return;

		fetch(`/api/debts?debtor=${session.user.id}`)
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
			}
		});

		// setOpenDebts(debts.filter((debt) => !debt.closed));
		// setClosedDebts(debts.filter((debt) => debt.closed));

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

	// Filter debts
	const handleFilterSelect = (e) => {
		setFilter(e.target.value);
	};

	const getName = (id) => {
		if (!users) return;
		const user = users.find((user) => user._id == id);
		if (!user) return;
		return user.name;
	};

	const filterDebt = (debt) => {
		if (!filter) return true;
		if (filter == "all") return true;
		if (filter == "open" && !debt.closed) return true;
		if (filter == "closed" && debt.closed) return true;
	};

	// Logged in
	return (
		<>
			<h1>Debts</h1>
			<p>A debt is the amount of money you owe someone</p>
			<p>You can settle multiple debts to the same person at once</p>
			<br />
			<Link href="/debts/create">New Debt</Link>
			<br />
			<h3>
				Total Amount:{" $"}
				{totalUnreceived !== null ? totalUnreceived : "Calculating..."}
			</h3>

			{/* Select Debt filter */}
			<select onChange={handleFilterSelect}>
				<option value="open">Open</option>
				<option value="closed">Closed</option>
				<option value="all">All</option>
			</select>

			{debts ? (
				debts.map((debt, index) => {
					// Filter debts
					if (!filterDebt(debt)) return;

					return (
						<div key={index}>
							<hr />
							<p>Creditor: {getName(debt.creditor)}</p>
							<p>
								Debtor:{" "}
								{debt.debtor == session.user.id
									? "You"
									: debt.debtor}
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

function formatDate(date) {
	const dateObject = new Date(date);
	const formattedDate = new Intl.DateTimeFormat("en-GB", {
		dateStyle: "full",
		timeStyle: "short",
		timeZone: "Australia/Sydney",
		hourCycle: "h12",
	}).format(dateObject);
	return formattedDate;
}
