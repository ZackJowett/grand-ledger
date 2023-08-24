import styles from "./Group.module.scss";
import Card from "components/card/Card";
import Title from "components/text/title/TextWithTitle";
import { useSession } from "next-auth/react";
import { useSelectedGroup, useUserStats } from "utils/hooks";
import Money from "components/text/money/Money";
import Spinner from "components/placeholders/spinner/Spinner";

export default function Group({ group }) {
	// get selected group
	// session
	const { data: session } = useSession();
	const { data: selectedGroup, isLoading: selectedGroupLoading } =
		useSelectedGroup(session.user.id);
	const stats = useUserStats(session.user.id, group._id);

	// if selected group is the same as this group, add selected class
	const isSelected =
		!selectedGroupLoading &&
		selectedGroup &&
		selectedGroup._id === group._id;

	return (
		<Card
			href={`/groups/${group._id}`}
			includeArrow
			title={group.name}
			titleClassName={`${isSelected ? styles.selected : null}`}
			className={styles.wrapper}
			badge={
				isSelected ? <p className={styles.badge}>Selected</p> : null
			}>
			<div className={styles.stats}>
				{/* <Card
					action="Members"
					light
					className={styles.actionCard}
					contentClassName={styles.content}>
					<h4>{group.members.length}</h4>
				</Card> */}
				<Card action={`My Debt`} light className={styles.actionCard}>
					{stats.isLoading ? (
						<Spinner />
					) : !stats.exists ? (
						"Error loading stats"
					) : (
						<Money amount={stats.data.current.debt} small />
					)}
				</Card>
				<Card action={`Unreceived`} light className={styles.actionCard}>
					{stats.isLoading ? (
						<Spinner />
					) : !stats.exists ? (
						"Error loading stats"
					) : (
						<Money amount={stats.data.current.unreceived} small />
					)}
				</Card>
			</div>
		</Card>
	);
}
