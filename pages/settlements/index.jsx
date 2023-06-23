import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllSettlements } from "/utils/data/settlements";
import Settlement from "/components/settlement/Settlement";
import Button from "/components/button/Button";
import styles from "public/styles/pages/Settlements.module.scss";
import Layout from "/components/layouts/Layout";
import LoggedOut from "/components/sections/login/loggedOut/LoggedOut";
import Card from "/components/card/Card";
import { useStore } from "react-redux";
import TextWithTitle from "components/text/title/TextWithTitle";
import Link from "next/link";
import { filterSettlements } from "/utils/helpers";
import { CardPlaceholder } from "components/placeholders/Placeholders";
import Select from "components/forms/Select";
import Spinner from "components/placeholders/spinner/Spinner";
import { FiPlusSquare } from "react-icons/fi";
import { TiArrowForward } from "react-icons/ti";

export default function Settlements() {
	// Session
	const { data: session, status: sessionStatus } = useSession();

	// Redux Store
	const state = useStore().getState();

	// User logged in
	// States
	const [settlements, setSettlements] = useState(null);
	const [filter, setFilter] = useState("all"); // "all" || "open" || "closed"

	// Get settlements
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;

		getAllSettlements(session.user.id).then((data) => {
			data ? setSettlements(data) : console.log("Error fetching data");
		});
	}, [session, sessionStatus]);

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	const handleFilterSelect = (option) => {
		setFilter(option.value);
	};

	const options = [
		{ value: "all", label: "All" },
		{ value: "reopened", label: "Reopened" },
		{ value: "pending", label: "Pending" },
		{ value: "closed", label: "Closed" },
	];

	return (
		<Layout>
			<section className={styles.wrapper}>
				<div className={styles.heading}>
					<TextWithTitle
						title="Settlements"
						text="An offer to close multiple debts to the same person"
						align="left"
					/>
				</div>
				<div className={styles.buttons}>
					<Button
						title="New Settlement"
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
				<Card dark title="Settlements">
					<hr className={styles.hr} />
					<Select
						options={options}
						defaultValue={options[0]}
						className={styles.select}
						onChange={handleFilterSelect}
					/>
					<div className={styles.cards}>
						{settlements && settlements.length == 0 && (
							<p className={styles.noSettlements}>
								{`You have no ${
									filter != "all" ? filter : ""
								} settlements`}
							</p>
						)}
						{settlements ? (
							settlements.map((settlement, index) => {
								if (!filterSettlements(settlement, filter))
									return;

								return (
									<Settlement
										key={index}
										settlement={settlement}
										globals={{
											users: state.userList.users,
											session: session,
										}}
										className={styles.settlement}
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
