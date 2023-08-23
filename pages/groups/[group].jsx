import styles from "public/styles/pages/Group.module.scss";
import Card from "components/card/Card";
import Title from "components/text/title/TextWithTitle";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useGroup } from "utils/hooks";
import Spinner from "components/placeholders/spinner/Spinner";
import { useUsers } from "utils/hooks";
import { formatDate } from "utils/helpers";
import Link from "next/link";
import Button from "components/button/Button";
import { leaveGroup } from "utils/data/groups";
import { toast } from "utils/toasts";
import { useState } from "react";

export default function Group() {
	const router = useRouter();
	const { data: session } = useSession();
	const { data: group, isLoading: groupLoading } = useGroup(
		router.query.group
	);
	const [loading, setLoading] = useState(false);

	function handleLeave() {
		setLoading(true);
		toast(leaveGroup(session.user.id, group._id), false, {
			loading: "Leaving...",
			success: "Successfully left Group! Refreshing...",
			error: "Failed to leave group",
		}).then((res) => {
			setLoading(false);
			if (res && res.success) {
				setTimeout(() => {
					router.push("/groups");
				}, 2000);
			}
		});
	}

	return (
		<section className={styles.wrapper}>
			{groupLoading ? (
				<Spinner />
			) : group ? (
				group.members.includes(session.user.id) ? (
					<>
						<Title
							title={group.name}
							align="left"
							text={`Join code: ${group.code}`}
						/>

						<Members group={group} />

						<Card action="Created" className={styles.created}>
							{formatDate(group.dateCreated, true)}
						</Card>
						<Button
							title="Leave"
							onClick={handleLeave}
							className={styles.leave}
							includeConfirm
							disabled={loading}
						/>
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
	const { data: users, isLoading: usersLoading } = useUsers();

	// Get names of

	return (
		<div className={styles.membersWrapper}>
			<Title title="Members" align="left" />
			<Card className={styles.membersCard}>
				{usersLoading ? (
					<Spinner />
				) : (
					group.members.map((member) => {
						// Check if admin and creator
						const isAdmin = group.admins.includes(member);
						const isCreator = group.creator == member;

						return (
							<Link
								className={styles.member}
								href={`/profile/${member}`}>
								<p>
									{
										users.find((user) => {
											console.log(user._id == member);
											return user._id == member;
										}).name
									}
								</p>
								<p className={styles.memberStatus}>
									{isAdmin ? "Admin" : null}
								</p>
								<p className={styles.memberStatus}>
									{isCreator ? "Creator" : null}
								</p>
							</Link>
						);
					})
				)}
			</Card>
		</div>
	);
}
