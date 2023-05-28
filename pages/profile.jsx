import { signOut, useSession } from "next-auth/react";
import Layout from "../components/layouts/Layout";
import LoggedOut from "../components/sections/login/loggedOut/LoggedOut";
import Card from "../components/card/Card";
import styles from "public/styles/pages/Profile.module.scss";
import Button from "../components/button/Button";

export default function Profile() {
	const { data: session } = useSession();

	return (
		<Layout>
			<section className={styles.section}>
				{session ? (
					<>
						{/* <ProfilePhoto /> */}
						<Card pretitle="Hello" title={session.user.name} dark />
						{/* <UserDetails /> */}
						{/* <UserBankDetails /> */}
						{/* <UserStatistics /> */}

						<Card dark>
							<p>You are logged in</p>
							<p>Name: {session.user.name}</p>
							<p>Email: {session.user.email}</p>
							<p>Username: {session.user.username}</p>
							<Button
								title="Sign out"
								onClick={() => signOut()}
							/>
						</Card>
					</>
				) : (
					<LoggedOut />
				)}
			</section>
		</Layout>
	);
}
