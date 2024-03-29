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

export default function Groups() {
	const { data: session, status: sessionStatus } = useSession();

	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState(null);

	// Get All users
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;
		getAllUsers().then((res) => {
			setUsers(res);
			setLoading(false);
		});
	}, [sessionStatus]);

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	return (
		<section className={styles.wrapper}>
			<TextWithTitle title="Groups" text="Coming Soon" />
			{loading ? (
				<Spinner />
			) : (
				<ul className={styles.list}>
					<hr />
					<TextWithTitle text="Friends" />
					{users ? (
						users.map((user) => (
							<li key={user._id}>
								<Button
									href={`/profile/${user._id}`}
									title={user.name}
								/>
							</li>
						))
					) : (
						<p>Couldn&apos;t load users</p>
					)}
				</ul>
			)}
		</section>
	);
}
