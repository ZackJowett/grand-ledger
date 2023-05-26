import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllForDebtor } from "/utils/data/debts";
import { getAllUsers } from "/utils/data/users";
import Debt from "components/debt/Debt";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import styles from "../../public/styles/pages/Debts.module.scss";
import Button from "components/button/Button";
import Card from "components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import { filterDebts } from "/utils/helpers";
import Money from "components/text/money/Money";
import { CardPlaceholder } from "components/placeholders/Placeholders";

export default function Debts() {
	const { data: session } = useSession();

	// Get debts from database
	const [debts, setDebts] = useState(null);
	// const [openDebts, setOpenDebts] = useState(null); // debts.filter(debt => !debt.closed)
	// const [closedDebts, setClosedDebts] = useState(null);
	const [users, setUsers] = useState(null);
	const [filter, setFilter] = useState("outstanding"); // "all" || "open" || "closed"
	const [totalDebt, setTotalDebt] = useState(null);

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

		// Get total amount outstanding
		debts.forEach((debt) => {
			if (debt.status == "outstanding") {
				total += debt.amount;
			}
		});

		// setOpenDebts(debts.filter((debt) => !debt.closed));
		// setClosedDebts(debts.filter((debt) => debt.closed));

		setTotalDebt(total.toFixed(2));
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
		console.log(filter);
	};

	// Logged in
	return (
		<Layout>
			<section className={styles.wrapper}>
				<Card dark>
					<TextWithTitle
						title="Debts"
						text="A debt is the amount of money you owe someone"
						align="left"
					/>
					<br />
					<p>
						You can settle multiple debts to the same person at once{" "}
						<Link
							href="/settlements/create"
							className={styles.link}>
							here
						</Link>
					</p>
				</Card>
				<Card dark>
					<h3>
						Total Amount (Outstanding):
						{totalDebt !== null ? (
							<Money amount={totalDebt} />
						) : (
							"Calculating..."
						)}
					</h3>
				</Card>
				<Button
					title="Create Debt"
					href="/debts/create"
					className={styles.create}
				/>
				<Card dark title="Debts" className={styles.debtsWrapper}>
					<hr className={styles.hr} />
					<select onChange={handleFilterSelect}>
						<option value="outstanding">Outstanding</option>
						<option value="pending">Pending</option>
						<option value="closed">Closed</option>
						<option value="all">All</option>
					</select>
					<div className={styles.cards}>
						{debts ? (
							debts.map((debt, index) => {
								if (!filterDebts(debt, filter)) return;

								return (
									<Debt
										key={index}
										debt={debt}
										globals={{
											session: session,
											users: users,
										}}
									/>
								);
							})
						) : (
							<>
								<CardPlaceholder />
								<CardPlaceholder />
								<CardPlaceholder />
							</>
						)}
					</div>
				</Card>
			</section>
		</Layout>
	);
}
