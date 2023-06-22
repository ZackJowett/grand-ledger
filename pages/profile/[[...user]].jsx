import { signOut, useSession } from "next-auth/react";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";
import Card from "../../components/card/Card";
import styles from "public/styles/pages/Profile.module.scss";
import Button from "../../components/button/Button";
import ProfilePhoto from "../../components/profile/photo/ProfilePhoto";
import UserDetails from "../../components/profile/details/UserDetails";
import { useRouter } from "next/router";
import Spinner from "components/placeholders/spinner/Spinner";
import { useState, useEffect } from "react";
import { getOne } from "utils/data/users";
import BankDetails from "components/profile/details/BankDetails";
import UserStatistics from "components/profile/stats/UserStatistics";

// Displays the logged in user if no user is specified in url query
// Displays the specified user if a user is specified in url query
export default function Profile() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		setLoading(true);
		if (status !== "authenticated") return;

		// Specific user is specified
		if (router.query.user) {
			// Get user data if
			getOne(router.query.user[0])
				.then((res) => {
					setUser(res);
				})
				.then(() => {
					setLoading(false);
				});
		} else {
			// No user is specified
			getOne(session.user.id)
				.then((res) => {
					setUser(res);
				})
				.then(() => {
					setLoading(false);
				});
			setLoading(false);
		}
	}, [session, router.query.user]);

	if (status === "unauthenticated") {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	console.log(user);

	const userIsLoggedIn = session && user && session.user.id === user._id;

	return (
		<Layout>
			<section className={styles.section}>
				{loading ? (
					<Spinner title="Loading profile information..." />
				) : (
					<>
						{user ? (
							<>
								<Card className={styles.detailsWrapper}>
									<div className={styles.details}>
										<div className={styles.welcome}>
											<Card
												pretitle={
													userIsLoggedIn
														? "Hello"
														: null
												}
												title={user.name}
												className={styles.welcomeCard}
												dark
											/>
											<ProfilePhoto
												className={styles.photo}
											/>
										</div>

										<UserDetails
											className={styles.userDetails}
											user={user}
										/>
									</div>
								</Card>

								<BankDetails user={user} />

								{/* Show statistcs if logged in */}
								{userIsLoggedIn && (
									<UserStatistics user={user} />
								)}

								<Button
									title="Sign out"
									onClick={() => signOut()}
									className={styles.signOut}
								/>
							</>
						) : (
							<p>User does not exist.</p>
						)}
					</>
				)}
			</section>
		</Layout>
	);
}
