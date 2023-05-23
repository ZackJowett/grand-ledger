import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getName } from "/utils/helpers";
import { getAllUsers } from "/utils/data/users";
import { getAllSettlements } from "/utils/data/settlements";
import Settlement from "../../components/settlement/Settlement";
import InfoBanner from "../../components/banner/InfoBanner";
import Button from "../../components/button/Button";
import styles from "public/styles/pages/Settlements.module.scss";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";

export default function Settlements() {
	// Session
	const { data: session } = useSession();

	// User logged in
	// States
	const [settlements, setSettlements] = useState(null);
	const [users, setUsers] = useState(null);

	// Get settlements
	useEffect(() => {
		if (!session) return;

		getAllSettlements(session.user.id).then((data) => {
			data ? setSettlements(data) : console.log("Error fetching data");
		});

		// Get user information regarding settlements
		getAllUsers().then((data) => {
			data ? setUsers(data) : console.log("Error fetching data");
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

	return (
		<Layout>
			<InfoBanner title="What is a settlement?">
				<p>
					Settlements are <strong>CLOSURES OF MULTIPLE DEBTS</strong>{" "}
					to the same person.
				</p>
				<br />
				<p>
					Whoever <strong>OWES THE MOST</strong> must{" "}
					<strong>CREATE IT</strong>.
				</p>
				<br />
				<p>
					A new settlement is <strong>PENDING</strong> until the other
					person approves it.
				</p>
			</InfoBanner>

			<h1 className={styles.title}>Settlements</h1>
			<Button
				title="Create Settlement"
				href="/settlements/create"
				className={styles.newSettlement}
			/>
			{settlements
				? settlements.map((settlement, index) => {
						return (
							<Settlement
								key={index}
								settlement={settlement}
								globals={{ users: users, session: session }}
							/>
						);
				  })
				: "Loading settlements..."}
		</Layout>
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
