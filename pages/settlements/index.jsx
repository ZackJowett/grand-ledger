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

export default function Settlements() {
	// Session
	const { data: session } = useSession();

	// Redux Store
	const state = useStore().getState();

	// User logged in
	// States
	const [settlements, setSettlements] = useState(null);

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

	return (
		<Layout>
			{/* <InfoBanner title="What is a settlement?">
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
			</InfoBanner> */}

			<Button
				title="Create Settlement"
				href="/settlements/create"
				className={styles.newSettlement}
			/>
			<Card dark title="Settlements" className={styles.settlements}>
				{settlements
					? settlements.map((settlement, index) => {
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
					: "Loading settlements..."}
			</Card>
		</Layout>
	);
}
