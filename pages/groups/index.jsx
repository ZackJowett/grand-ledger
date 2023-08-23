import { useSession } from "next-auth/react";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import Spinner from "components/placeholders/spinner/Spinner";
import { getAllUsers } from "utils/data/users";
import Link from "next/link";
import { useEffect, useState } from "react";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "public/styles/pages/Groups.module.scss";
import Button from "components/button/Button";
import { createGroup } from "utils/data/groups";
import { useGroupsWithUser, useSelectedGroup, useUsers } from "utils/hooks";
import GroupList from "components/group/list/GroupList";
import GroupJoin from "components/group/join/GroupJoin";

export default function Groups() {
	const { data: session, status: sessionStatus } = useSession();
	const groups = useGroupsWithUser(session.user.id);
	const users = useUsers();

	function newGroup() {
		createGroup(
			"Group 5",
			[session.user.id],
			[session.user.id],
			session.user.id
		);
	}

	return (
		<section className={styles.wrapper}>
			<TextWithTitle title="Groups" />
			<GroupJoin user={session.user} />
			{groups.isLoading || users.isLoading ? (
				<Spinner />
			) : !groups.exists || !users.exists ? (
				<p>Something went wrong</p>
			) : groups.data && groups.data.length > 0 ? (
				<GroupList groups={groups.data} />
			) : (
				<p>You are not in any groups</p>
			)}
			{/* <button onClick={newGroup}>Create Group</button> */}
		</section>
	);
}
