import styles from "./RecentDebts.module.scss";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Debt from "/components/debt/Debt";
import { CardPlaceholder } from "/components/placeholders/Placeholders";
import { MdRefresh } from "react-icons/md";
import Title from "/components/text/title/TextWithTitle";
import { useSelectedGroup, useDebtorDebts } from "/utils/hooks";
import { formatDate } from "/utils/helpers";

export default function RecentDebts({ className }) {
	const { data: session, status: sessionStatus } = useSession();
	const group = useSelectedGroup(session.user.id);

	const debts = useDebtorDebts(
		session.user.id,
		group.exists ? group.data._id : null
	);

	// const [timeFetched, setTimeFetched] = useState(null); // [user
	const [showAmount, setShowAmount] = useState(4); // Number to show

	// useEffect(() => {
	// 	// Set time fetched
	// 	setTimeFetched(new Date());
	// }, [debts.data]);

	// No session data yet
	if (sessionStatus === "loading") return;

	// const handleViewMore = () => {
	// 	if (debts.data.length - showAmount < 3) {
	// 		setShowAmount(debts.length);
	// 	} else {
	// 		setShowAmount(showAmount + 3);
	// 	}
	// };

	// function handleRefresh() {
	// 	debts.mutate(() => true, undefined, { revalidate: true });
	// 	setTimeFetched(new Date());
	// }

	// console.log(debts);

	return (
		<section className={styles.wrapper}>
			<Title
				title="Recent Debts"
				// text={formatDate(timeFetched)}
				align="left"
				link="/debts"
			/>
			{/* <div className={styles.refresh} onClick={handleRefresh}>
				<MdRefresh className={styles.icon} />
			</div> */}
			{debts.isLoading || group.isLoading ? (
				<>
					<CardPlaceholder dark />
					<CardPlaceholder dark />
					<CardPlaceholder dark />
				</>
			) : !debts.exists ? (
				<p>Could not load Debts</p>
			) : debts.data.length <= 0 ? (
				<p>No debts</p>
			) : (
				debts.data.map((debt, index) => {
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
