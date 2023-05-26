import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllSettlements } from "/utils/data/settlements";
import Settlement from "/components/settlement/Settlement";
import Button from "/components/button/Button";
import styles from "public/styles/pages/Debts.module.scss";
import Layout from "/components/layouts/Layout";
import LoggedOut from "/components/sections/login/loggedOut/LoggedOut";
import Card from "/components/card/Card";
import { useStore } from "react-redux";
import TextWithTitle from "components/text/title/TextWithTitle";
import Link from "next/link";
import { filterSettlements } from "/utils/helpers";
import { CardPlaceholder } from "components/placeholders/Placeholders";

export default function Settlements() {
	// Session
	const { data: session } = useSession();

	// Redux Store
	const state = useStore().getState();

	// User logged in
	// States
	const [settlements, setSettlements] = useState(null);
	const [filter, setFilter] = useState("all"); // "all" || "open" || "closed"

	// Get settlements
	useEffect(() => {
		if (!session) return;

		getAllSettlements(session.user.id).then((data) => {
			data ? setSettlements(data) : console.log("Error fetching data");
		});
	}, [session]);

	// User not logged in
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

	return (
		<Layout>
			<section className={styles.wrapper}>
				<Card dark>
					<TextWithTitle
						title="Settlements"
						text="An offer to close multiple debts to the same person"
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
					<h3>Totals</h3>
				</Card>
				<Button
					title="Create Settlement"
					href="/settlements/create"
					className={styles.create}
				/>
				<Card dark title="Settlements">
					<hr />
					<select onChange={handleFilterSelect}>
						<option value="pending">Pending</option>
						<option value="reopened">Reopened</option>
						<option value="closed">Closed</option>
						<option value="all" selected="selected">
							All
						</option>{" "}
					</select>
					<div className={styles.cards}>
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
