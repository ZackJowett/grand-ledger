import styles from "./RecentDebts.module.scss";
import Card from "/components/card/Card";
import { useSession } from "next-auth/react";
import { getAllForDebtor } from "/utils/data/debts";
import { useEffect, useState } from "react";
import Debt from "/components/debt/Debt";
import TextButton from "/components/button/text/TextButton";
import { CardPlaceholder } from "/components/placeholders/Placeholders";
import { MdRefresh } from "react-icons/md";
import Title from "/components/text/title/TextWithTitle";
import { useSelectedGroup, useDebtorDebts } from "/utils/hooks";

export default function RecentDebts({ className }) {
	const { data: session } = useSession();
	const {
		data: selectedGroup,
		isLoading: groupLoading,
		isError: groupError,
		mutate: mutateGroup,
	} = useSelectedGroup(session.user.id);

	const {
		data: debts,
		isLoading: debtsLoading,
		isError: debtsError,
		mutate: mutateDebts,
	} = useDebtorDebts(
		session.user.id,
		selectedGroup ? selectedGroup._id : null
	);

	const [timeFetched, setTimeFetched] = useState(null); // [user
	const [showAmount, setShowAmount] = useState(4); // Number to show

	useEffect(() => {
		// Set time fetched
		setTimeFetched(new Date());
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

	function handleRefresh() {
		mutateDebts(true);
	}

	return (
		<section className={styles.wrapper}>
			<Title title="Recent Debts" align="left" link="/debts" />
			<div className={styles.refresh} onClick={handleRefresh}>
				<MdRefresh className={styles.icon} />
			</div>
			{debtsLoading || groupLoading ? (
				<>
					<CardPlaceholder />
					<CardPlaceholder />
					<CardPlaceholder />
				</>
			) : !debts || debtsError ? (
				<p>Debts failed to load</p>
			) : debts.length <= 0 ? (
				<p>No debts</p>
			) : (
				debts.map((debt, index) => {
					if (index >= showAmount) return;
					return (
						<Debt
							key={index}
							debt={debt}
							session={session}
							className={styles.debt}
							dark
						/>
					);
				})
			)}

			{/* Show / Hide view more devts button */}
			{/* Links to all deebts when max reached */}
			{/* {debts &&
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
			)} */}
		</section>
	);
}
