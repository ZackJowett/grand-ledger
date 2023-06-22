import styles from "./RecentDebts.module.scss";
import Card from "/components/card/Card";
import { useSession } from "next-auth/react";
import { getAllForDebtor } from "/utils/data/debts";
import { useEffect, useState } from "react";
import Debt from "/components/debt/Debt";
import TextButton from "/components/button/text/TextButton";
import { CardPlaceholder } from "/components/placeholders/Placeholders";
import { MdRefresh } from "react-icons/md";
// import { useStore } from "react-redux";
import { timeSince } from "/utils/helpers";

export default function RecentDebts({ className }) {
	const { data: session } = useSession();

	const [debts, setDebts] = useState(null);
	const [timeFetched, setTimeFetched] = useState(null); // [user
	const [showAmount, setShowAmount] = useState(3); // Number to show

	useEffect(() => {
		if (!session) return;

		getData();
	}, [session]);

	useEffect(() => {
		// Set time fetched
		setTimeFetched(new Date());
	}, [debts]);

	// No session data yet
	if (!session) return;

	function getData() {
		getAllForDebtor(session.user.id).then((data) => {
			data ? setDebts(data) : console.log("Error fetching debts");
		});
	}

	const handleViewMore = () => {
		if (debts.length - showAmount < 3) {
			setShowAmount(debts.length);
		} else {
			setShowAmount(showAmount + 3);
		}
	};

	function handleRefresh() {
		setDebts(null);
		getData();
	}

	return (
		<Card
			title="Recent Debts"
			subtitle={`Updated: ${
				timeFetched ? timeSince(timeFetched) : "..."
			}`}
			link="/debts"
			dark
			className={`${className} ${styles.wrapper}`}>
			<div className={styles.refresh} onClick={handleRefresh}>
				<MdRefresh className={styles.icon} />
			</div>
			{debts ? (
				debts.map((debt, index) => {
					if (index >= showAmount) return;
					return (
						<Debt
							key={index}
							debt={debt}
							session={session}
							className={styles.debt}
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

			{/* Show / Hide view more devts button */}
			{/* Links to all deebts when max reached */}
			{debts &&
			showAmount != debts.length &&
			showAmount < debts.length ? (
				<TextButton
					title="View More"
					onClick={handleViewMore}
					className={styles.viewMore}
				/>
			) : (
				<TextButton
					title="Go to Debts"
					link="/debts"
					className={styles.viewMore}
				/>
			)}
		</Card>
	);
}
