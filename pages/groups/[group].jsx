import styles from "public/styles/pages/Group.module.scss";
import Card from "components/card/Card";
import Title from "components/text/title/TextWithTitle";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useGroup, useSelectedGroup } from "utils/hooks";
import Spinner from "components/placeholders/spinner/Spinner";
import { useUsers } from "utils/hooks";
import { formatDate } from "utils/helpers";
import Link from "next/link";
import Button from "components/button/Button";
import { leaveGroup, deleteGroup } from "utils/data/groups";
import { toast } from "utils/toasts";
import { useState } from "react";
import { globalRevalidate } from "utils/helpers";
import Badge from "components/text/badge/Badge";

export default function Group() {
	const router = useRouter();
	const { data: session } = useSession();
	const group = useGroup(router.query.group);
	const selectedGroup = useSelectedGroup(session.user.id);
	const [loading, setLoading] = useState(false);

	function handleLeave() {
		setLoading(true);
		toast(leaveGroup(session.user.id, group.data._id), false, {
			loading: "Leaving...",
			success: "Successfully left Group!",
			error: "Failed to leave Group",
		}).then((res) => {
			setLoading(false);
			if (res && res.success) {
				globalRevalidate();
				// setTimeout(() => {
				router.push("/groups");
				// 	mutate(() => true, undefined, { revalidate: true });
				// }, 2000);
			}
		});
	}

	function handleDelete() {
		setLoading(true);
		toast(deleteGroup(group.data._id), false, {
			loading: "Deleting Group...",
			success: "Successfully deleted Group!",
			error: "Failed to delete Group",
		}).then((res) => {
			setLoading(false);
			if (res && res.success) {
				globalRevalidate();
				router.push("/groups");
			}
		});
	}

	return (
		<section className={styles.wrapper}>
			{group.isLoading ? (
				<Spinner />
			) : group.exists ? (
				group.data.members.includes(session.user.id) ? (
					<>
						<Title
							title={group.data.name}
							align="left"
							text={`Join code: ${group.data.code}`}
						/>
						{selectedGroup.exists &&
							group.exists &&
							selectedGroup.data._id == group.data._id && (
								<Badge
									title={"Currently Selected"}
									color="group"
								/>
							)}

						<Members group={group.data} />

						<Card action="Created" className={styles.created}>
							{formatDate(group.data.dateCreated, true)}
						</Card>

						{/* Leave Group */}
						<Button
							title="Leave"
							onClick={handleLeave}
							className={styles.leave}
							includeConfirm
							disabled={loading}
						/>

						{/* Delete Group */}
						{group.data.creator == session.user.id && (
							<Button
								title="Delete Group"
								onClick={handleDelete}
								className={styles.leave}
								includeConfirm
								disabled={loading}
							/>
						)}
					</>
				) : (
					<div>You are not in this group</div>
				)
			) : (
				<div>Failed to load group</div>
			)}
		</section>
	);
}

function Members({ group }) {
	const users = useUsers();

	// Get names of

	return (
		<div className={styles.membersWrapper}>
			<Title title="Members" align="left" />
			<Card className={styles.membersCard}>
				{users.isLoading ? (
					<Spinner />
				) : (
					users.exists &&
					group.members.map((member) => {
						// Check if admin and creator
						const isAdmin = group.admins.includes(member);
						const isCreator = group.creator == member;

						return (
							<Link
								key={member._id}
								className={styles.member}
								href={`/profile/${member}`}>
								<p>
									{
										users.data.find((user) => {
											console.log(user._id == member);
											return user._id == member;
										}).name
									}
								</p>
								<p className={styles.memberStatus}>
									{isAdmin ? "Admin" : null}
								</p>
								{/* <p className={styles.memberStatus}>
									{isCreator ? "Creator" : null}
								</p> */}
							</Link>
						);
					})
				)}
			</Card>
		</div>
	);
}
