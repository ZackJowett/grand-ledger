import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllForDebtor } from "/utils/data/debts";
import { getAllUsers } from "/utils/data/users";
import Debt from "/components/debt/Debt";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";

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

		getAllForDebtor(session.user.id).then((data) => {
			data ? setDebts(data) : console.log("Error fetching data");
		});

		getAllUsers().then((data) => {
			data ? setUsers(data) : console.log("Error fetching data");
		});
	}, [session]);

	// Calculate total debt amount (excluding closed debts)
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
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	// Filter debts
	const handleFilterSelect = (e) => {
		setFilter(e.target.value);
	};

	const filterDebt = (debt) => {
		if (!filter) return true;
		if (filter == "all") return true;
		if (filter == "open" && !debt.closed) return true;
		if (filter == "closed" && debt.closed) return true;
	};

	// Logged in
	return (
		<Layout>
			<h1>Debts</h1>
			<p>A debt is the amount of money you owe someone</p>
			<p>
				You can settle multiple debts to the same person at once{" "}
				<Link href="/settlements/create">here</Link>
			</p>
			<br />
			<Link href="/debts/create">New Debt</Link>
			<br />
			<h3>
				Total Amount (Open):{" $"}
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
						<Debt
							key={index}
							debt={debt}
							globals={{ session: session, users: users }}
						/>
					);
				})
			) : (
				<p>Loading...</p>
			)}
		</Layout>
	);
}
