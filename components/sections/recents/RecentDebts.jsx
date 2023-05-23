import styles from "./RecentSettlements.module.scss";
import Card from "/components/card/Card";
import { useSession } from "next-auth/react";
import { getAllForDebtor } from "/utils/data/debts";
import { getAllUsers } from "/utils/data/users";
import { useEffect, useState } from "react";
import Debt from "/components/debt/Debt";
import TextButton from "/components/button/text/TextButton";

export default function RecentSettlements() {
	const { data: session } = useSession();

	const [debts, setDebts] = useState(null);
	const [users, setUsers] = useState(null); // [user
	const [showAmount, setShowAmount] = useState(3); // Number to show

	useEffect(() => {
		if (!session) return;

		getAllForDebtor(session.user.id).then((data) => {
			data ? setDebts(data) : console.log("Error fetching settlements");
			// Time fetched
			//....
		});

		getAllUsers(session.user.id).then((data) => {
			data ? setUsers(data) : console.log("Error fetching users");
		});
	}, [session]);

	if (!session || !debts) return;

	const handleViewMore = () => {
		if (debts.length - showAmount < 3) {
			setShowAmount(debts.length);
		} else {
			setShowAmount(showAmount + 3);
		}
	};

	return (
		<Card title="Recent Debts" subtitle="Updated: [TIME]" dark>
			{debts && users
				? debts.map((debt, index) => {
						if (index >= showAmount) return;
						return (
							<Debt
								key={index}
								debt={debt}
								globals={{ users: users, session: session }}
								className={styles.debt}
							/>
						);
				  })
				: "Loading..."}

			{/* Show / Hide view more settlements button */}
			{/* Links to all settlements when max reached */}
			{debts && showAmount != debts.length ? (
				<TextButton title="View More" onClick={handleViewMore} />
			) : (
				<TextButton title="Go to Debts" link="/debts" />
			)}
		</Card>
	);
}
