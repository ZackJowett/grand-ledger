import styles from "./RecentSettlements.module.scss";
import Card from "/components/card/Card";
import { useSession } from "next-auth/react";
import { getAllSettlements } from "/utils/data/settlements";
import { getAllUsers } from "/utils/data/users";
import { useEffect, useState } from "react";
import Settlement from "/components/settlement/Settlement";
import TextButton from "/components/button/text/TextButton";
import { CardPlaceholder } from "/components/placeholders/Placeholders";
import { MdRefresh } from "react-icons/md";

export default function RecentSettlements({ className }) {
	const { data: session } = useSession();

	const [settlements, setSettlements] = useState(null);
	const [users, setUsers] = useState(null); // [user
	const [showAmount, setShowAmount] = useState(3); // Number to show
	const [timeFetched, setTimeFetched] = useState(null);

	useEffect(() => {
		if (!session) return;

		getData();
	}, [session]);

	if (!session) return;

	function handleViewMore() {
		if (settlements.length - showAmount < 3) {
			setShowAmount(settlements.length);
		} else {
			setShowAmount(showAmount + 3);
		}
	}

	function getData() {
		if (!session) return;

		getAllSettlements(session.user.id)
			.then((data) => {
				data
					? setSettlements(data)
					: console.log("Error fetching settlements");
			})
			.then(() => {
				setTimeFetched(new Date().toLocaleTimeString());
			});

		getAllUsers(session.user.id).then((data) => {
			data ? setUsers(data) : console.log("Error fetching users");
		});
	}

	function handleRefresh() {
		setSettlements(null);
		setUsers(null);
		getData();
	}

	return (
		<Card
			title="Recent Settlements"
			subtitle={`Updated: ${timeFetched}`}
			link="/settlements"
			dark
			className={`${className} ${styles.wrapper}`}>
			<div className={styles.refresh} onClick={handleRefresh}>
				<MdRefresh className={styles.icon} />
			</div>
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
			{settlements &&
			showAmount != settlements.length &&
			showAmount < settlements.length ? (
				<TextButton
					title="View More"
					onClick={handleViewMore}
					className={styles.viewMore}
				/>
			) : (
				<TextButton
					title="Go to Settlements"
					link="/settlements"
					className={styles.viewMore}
				/>
			)}
		</Card>
	);
}
