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
import Select from "components/forms/Select";
import Spinner from "components/placeholders/spinner/Spinner";
import { FiPlusSquare } from "react-icons/fi";
import { TiArrowForward } from "react-icons/ti";

export default function Debts() {
	const { data: session, status: sessionStatus } = useSession();

	// Get debts from database
	const [debts, setDebts] = useState(null);
	// const [openDebts, setOpenDebts] = useState(null); // debts.filter(debt => !debt.closed)
	// const [closedDebts, setClosedDebts] = useState(null);
	const [users, setUsers] = useState(null);
	const [filter, setFilter] = useState("outstanding"); // "all" || "open" || "closed"
	const [userFilter, setUserFilter] = useState(null);
	const [totalDebt, setTotalDebt] = useState(null);

	// Get all debts associated with logged in user
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;

		getAllForDebtor(session.user.id).then((data) => {
			data ? setDebts(data) : console.log("Error fetching data");
		});

		getAllUsers().then((data) => {
			data ? setUsers(data) : console.log("Error fetching data");
		});
	}, [session, sessionStatus]);

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

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	// Loading
	if (!debts || !users) {
		return <Spinner />;
	}

	// Filter debts
	const handleFilterSelect = (option) => {
		setFilter(option.value);
	};
	const handleUserFilterSelect = (option) => {
		setUserFilter(option.value);
	};

	const options = [
		{ value: "all", label: "All" },
		{ value: "outstanding", label: "Outstanding" },
		{ value: "pending", label: "Pending" },
		{ value: "closed", label: "Closed" },
	];

	const userOptions = [
		{ value: null, label: "Everyone" },
		...users
			.map((user) => {
				// Don't include logged in user in filter
				if (user._id == session.user.id) return;
				return {
					value: user._id,
					label: user.name,
				};
			})
			.filter((item) => item), // removes	undefined items
	];

	// Logged in
	return (
		<section className={styles.wrapper}>
			<div className={styles.heading}>
				<TextWithTitle
					title="Debts"
					text="A debt is an amount of money you owe someone"
					align="left"
				/>
				<p className={styles.callToSettle}>
					You can settle multiple debts to the same person at once{" "}
					<Link href="/settlements/create" className={styles.link}>
						here
					</Link>
				</p>
			</div>
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
					secondary
				/>
			</div>

			<Card dark title="Debts" className={styles.debtsWrapper}>
				{totalDebt ? (
					<TextWithTitle
						title={
							<Money
								amount={-totalDebt}
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
				<div className={styles.filters}>
					<Select
						options={options}
						defaultValue={options[1]}
						className={styles.select}
						onChange={handleFilterSelect}
					/>
					<Select
						options={userOptions}
						defaultValue={userOptions[0]}
						className={styles.select}
						onChange={handleUserFilterSelect}
					/>
				</div>
				<div className={styles.cards}>
					{debts && debts.length == 0 && (
						<p className={styles.noDebts}>
							{`You have no ${
								filter != "all" ? filter : ""
							} debts. Well done!`}
						</p>
					)}
					{debts ? (
						debts.map((debt, index) => {
							if (!filterDebts(debt, filter, userFilter)) return;

							return (
								<Debt
									key={index}
									debt={debt}
									globals={{
										session: session,
										users: users,
									}}
									light
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
	);
}
