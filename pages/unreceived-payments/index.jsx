import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllForCreditor } from "/utils/data/debts";
import { getAllUsers } from "/utils/data/users";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";
import Debt from "components/debt/Debt";
import styles from "../../public/styles/pages/Debts.module.scss";
import Card from "components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import Button from "components/button/Button";
import { filterDebts } from "/utils/helpers";
import { CardPlaceholder } from "components/placeholders/Placeholders";

export default function UnreceivedPayments() {
	const { data: session } = useSession();

	// Get debts from database
	const [debts, setDebts] = useState(null);
	const [users, setUsers] = useState(null);
	const [totalUnreceived, setTotalUnreceived] = useState(null);
	const [filter, setFilter] = useState("outstanding"); // "all" || "open" || "closed"

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

		let totalOpen = 0;
		let totalPending = 0;
		let totalClosed = 0;

		// Get total amount unreceived
		debts.forEach((debt) => {
			if (debt.status == "outstanding") {
				totalOpen += debt.amount;
			}
		});

		setTotalUnreceived(totalOpen.toFixed(2));
	}, [debts]);

	// Not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	const handleFilterSelect = (e) => {
		setFilter(e.target.value);
	};

	// Logged in
	return (
		<Layout>
			<section className={styles.wrapper}>
				<TextWithTitle
					title="Unreceived Payments"
					text="Debts someone owes you"
					align="left"
					className={styles.heading}
				/>
				<Card dark>
					<h3>
						Total Amount (Unreceived):{" $"}
						{totalUnreceived !== null
							? totalUnreceived
							: "Calculating..."}
					</h3>
				</Card>
				<Button
					title="Create Debt"
					href="/debts/create"
					className={styles.create}
				/>
				<Card
					dark
					title="Unreceived debts"
					className={styles.debtsWrapper}>
					<hr className={styles.hr} />
					<select onChange={handleFilterSelect}>
						<option value="outstanding">Unreceived</option>
						<option value="pending">Pending</option>
						<option value="closed">Closed</option>
						<option value="all">All</option>
					</select>
					<div className={styles.cards}>
						{debts && debts.length == 0 && (
							<p className={styles.noDebts}>
								{`There are no ${
									filter != "outstanding" && filter != "all"
										? filter
										: ""
								} unreceived debts`}
							</p>
						)}
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
										unreceived
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
