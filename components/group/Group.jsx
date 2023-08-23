import styles from "./Group.module.scss";
import Card from "components/card/Card";
import Title from "components/text/title/TextWithTitle";
import { useSession } from "next-auth/react";
import { useSelectedGroup } from "utils/hooks";

export default function Group({ group }) {
	// get selected group
	// session
	const { data: session } = useSession();
	const { data: selectedGroup, isLoading: selectedGroupLoading } =
		useSelectedGroup(session.user.id);

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
			<Card action="Members" light className={styles.members}>
				{group.members.length}
			</Card>
		</Card>
	);
}
