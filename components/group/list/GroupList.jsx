import styles from "./GroupList.module.scss";
import Group from "components/group/Group";

export default function GroupList({ groups }) {
	return (
		<section className={styles.wrapper}>
			{groups.map((group) => (
				<Group group={group} key={group._id} />
			))}
		</section>
	);
}
