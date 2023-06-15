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
import Select from "components/forms/Select";
import Spinner from "components/placeholders/spinner/Spinner";
import Money from "components/text/money/Money";
import { FiPlusSquare } from "react-icons/fi";
import { TiArrowForward } from "react-icons/ti";

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

	const handleFilterSelect = (option) => {
		setFilter(option.value);
	};

	const options = [
		{ value: "all", label: "All" },
		{ value: "outstanding", label: "Unreceived" },
		{ value: "pending", label: "Pending" },
		{ value: "closed", label: "Closed" },
	];

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

				<div className={styles.buttons}>
					<Button
						title="Pay Someone"
						icon={<TiArrowForward />}
						href="/settlements/create"
						className={styles.create}
					/>
					<Button
						title="New Debt"
						icon={<FiPlusSquare />}
						href="/debts/create"
						className={styles.create}
					/>
				</div>
				<Card
					dark
					title="Unreceived Payments"
					className={styles.debtsWrapper}>
					{totalUnreceived ? (
						<TextWithTitle
							title={
								<Money
									amount={totalUnreceived}
									background
									backgroundFit
									padding
								/>
							}
							text={"Total Outstanding"}
							small
							reverse
							align="left"
							className={styles.totals}
						/>
					) : (
						<Spinner title="Calculating totals..." />
					)}
					<hr className={styles.hr} />
					<Select
						options={options}
						defaultValue={options[1]}
						className={styles.select}
						onChange={handleFilterSelect}
					/>
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
