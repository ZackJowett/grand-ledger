import styles from "./RecentDebts.module.scss";
import Card from "/components/card/Card";
import { useSession } from "next-auth/react";
import { getAllForDebtor } from "/utils/data/debts";
import { useEffect, useState } from "react";
import Debt from "/components/debt/Debt";
import TextButton from "/components/button/text/TextButton";
import { CardPlaceholder } from "/components/placeholders/Placeholders";
// import { useStore } from "react-redux";

export default function RecentDebts({ className }) {
	const { data: session } = useSession();

	const [debts, setDebts] = useState(null);
	const [timeFetched, setTimeFetched] = useState(null); // [user
	const [showAmount, setShowAmount] = useState(3); // Number to show

	useEffect(() => {
		if (!session) return;

		getAllForDebtor(session.user.id).then((data) => {
			data ? setDebts(data) : console.log("Error fetching debts");
		});
	}, [session]);

	useEffect(() => {
		// Set time fetched
		setTimeFetched(new Date().toLocaleTimeString());
	}, [debts]);

	// No session data yet
	if (!session) return;

	const handleViewMore = () => {
		if (debts.length - showAmount < 3) {
			setShowAmount(debts.length);
		} else {
			setShowAmount(showAmount + 3);
		}
	};

	return (
		<Card
			title="Recent Debts"
			subtitle={`Updated: ${timeFetched ? timeFetched : "..."}`}
			link="/debts"
			dark
			className={`${className} ${styles.wrapper}`}>
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
				<TextButton title="View More" onClick={handleViewMore} />
			) : (
				<TextButton title="Go to Debts" link="/debts" />
			)}
		</Card>
	);
}
