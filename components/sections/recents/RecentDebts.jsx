import styles from "./RecentDebts.module.scss";
import Card from "/components/card/Card";
import { useSession } from "next-auth/react";
import { getAllForDebtor } from "/utils/data/debts";
import { useEffect, useState } from "react";
import Debt from "/components/debt/Debt";
import TextButton from "/components/button/text/TextButton";
// import { useStore } from "react-redux";

export default function RecentDebts({ className }) {
	const { data: session } = useSession();

	const [debts, setDebts] = useState(null);
	const [showAmount, setShowAmount] = useState(3); // Number to show

	useEffect(() => {
		if (!session) return;

		getAllForDebtor(session.user.id).then((data) => {
			data ? setDebts(data) : console.log("Error fetching debts");
			// Time fetched
			//....
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
		<Card
			title="Recent Debts"
			subtitle="Updated: [TIME]"
			dark
			className={`${className} ${styles.wrapper}`}>
			{debts
				? debts.map((debt, index) => {
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
				: "Loading..."}

			{/* Show / Hide view more devts button */}
			{/* Links to all deebts when max reached */}
			{debts && showAmount != debts.length ? (
				<TextButton title="View More" onClick={handleViewMore} />
			) : (
				<TextButton title="Go to Debts" link="/debts" />
			)}
		</Card>
	);
}
