import { signOut, useSession } from "next-auth/react";
import Layout from "../components/layouts/Layout";
import LoggedOut from "../components/sections/login/loggedOut/LoggedOut";
import Card from "../components/card/Card";
import styles from "public/styles/pages/Profile.module.scss";
import Button from "../components/button/Button";
import ProfilePhoto from "../components/profile/photo/ProfilePhoto";
import UserDetails from "../components/profile/details/UserDetails";

export default function Profile() {
	const { data: session } = useSession();

	return (
		<Layout>
			<section className={styles.section}>
				{session ? (
					<>
						<Card className={styles.detailsWrapper}>
							<div className={styles.details}>
								<div className={styles.welcome}>
									<Card
										pretitle="Hello"
										title={session.user.name}
										className={styles.welcomeCard}
										dark
									/>
									<ProfilePhoto className={styles.photo} />
								</div>

								<UserDetails
									className={styles.userDetails}
									user={session.user}
								/>
							</div>
						</Card>

						{/* <UserBankDetails /> */}
						{/* <UserStatistics /> */}
						<Button
							title="Sign out"
							onClick={() => signOut()}
							className={styles.signOut}
						/>
					</>
				) : (
					<LoggedOut />
				)}
			</section>
		</Layout>
	);
}
