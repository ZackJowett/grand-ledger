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
import TextWithTitle from "/components/text/title/TextWithTitle";
import {
	useSettlementsWithUser,
	useUsers,
	useSelectedGroup,
} from "/utils/hooks";

export default function RecentSettlements({ className }) {
	const { data: session } = useSession();
	const users = useUsers();
	const group = useSelectedGroup(session.user.id);
	const settlements = useSettlementsWithUser(
		session.user.id,
		group.exists ? group.data._id : null
	);

	const [showAmount, setShowAmount] = useState(4); // Number to show
	const [loading, setLoading] = useState(true); // [user

	return (
		<section className={styles.wrapper}>
			<TextWithTitle
				title="Recent Settlements"
				align="left"
				link="/settlements"
			/>
			{/* <div className={styles.refresh} onClick={handleRefresh}>
				<MdRefresh className={styles.icon} />
			</div> */}
			{settlements.isLoading || users.isLoading || group.isLoading ? (
				<>
					<CardPlaceholder dark />
					<CardPlaceholder dark />
					<CardPlaceholder dark />
				</>
			) : !settlements.exists || !users.exists || !group.exists ? (
				<p>Settlements could not be loaded</p>
			) : settlements.data.length <= 0 ? (
				<p>No settlements</p>
			) : (
				settlements.data.map((settlement, index) => {
					if (index >= showAmount) return;
					return (
						<Settlement
							key={index}
							settlement={settlement}
							globals={{ users: users, session: session }}
							className={styles.settlement}
							dark
						/>
					);
				})
			)}

			{/* Show / Hide view more settlements button */}
			{/* Links to all settlements when max reached */}
			{/* {settlements &&
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
			)} */}
		</section>
	);
}
