import styles from "./RecentSettlements.module.scss";
import Card from "/components/card/Card";
import { useSession } from "next-auth/react";
import { getAllSettlements } from "/utils/data/settlements";
import { getAllUsers } from "/utils/data/users";
import { useEffect, useState } from "react";
import Settlement from "/components/settlement/Settlement";
import TextButton from "/components/button/text/TextButton";
import { CardPlaceholder } from "/components/placeholders/Placeholders";

export default function RecentSettlements({ className }) {
	const { data: session } = useSession();

	const [settlements, setSettlements] = useState(null);
	const [users, setUsers] = useState(null); // [user
	const [showAmount, setShowAmount] = useState(3); // Number to show

	useEffect(() => {
		if (!session) return;

		getAllSettlements(session.user.id).then((data) => {
			data
				? setSettlements(data)
				: console.log("Error fetching settlements");
			// Time fetched
			//....
		});

		getAllUsers(session.user.id).then((data) => {
			data ? setUsers(data) : console.log("Error fetching users");
		});
	}, [session]);

	if (!session) return;

	const handleViewMore = () => {
		if (settlements.length - showAmount < 3) {
			setShowAmount(settlements.length);
		} else {
			setShowAmount(showAmount + 3);
		}
	};

	return (
		<Card
			title="Recent Settlements"
			subtitle="Updated: [TIME]"
			link="/settlements"
			dark
			className={className}>
			{settlements && users ? (
				settlements.map((settlement, index) => {
					if (index >= showAmount) return;
					return (
						<Settlement
							key={index}
							settlement={settlement}
							globals={{ users: users, session: session }}
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

			{/* Show / Hide view more settlements button */}
			{/* Links to all settlements when max reached */}
			{settlements && showAmount != settlements.length ? (
				<TextButton title="View More" onClick={handleViewMore} />
			) : (
				<TextButton title="Go to Settlements" link="/settlements" />
			)}
		</Card>
	);
}
