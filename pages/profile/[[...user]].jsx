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
import { getOne, setAvatar } from "utils/data/users";
import BankDetails from "components/profile/details/BankDetails";
import UserStatistics from "components/profile/stats/UserStatistics";
import TextButton from "components/button/text/TextButton";
import { CldUploadButton } from "next-cloudinary";

// Displays the logged in user if no user is specified in url query
// Displays the specified user if a user is specified in url query
export default function Profile() {
	const { data: session, status: sessionStatus } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		setLoading(true);
		if (sessionStatus !== "authenticated") return;

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
		}
	}, [session, sessionStatus, router.query.user]);

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	console.log(user);

	const userIsLoggedIn =
		sessionStatus == "authenticated" &&
		user &&
		session.user.id === user._id;

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
												url={
													user.avatarURL
														? user.avatarURL
														: null
												}
											/>
										</div>
										<BankDetails
											user={user}
											className={styles.bankDetails}
										/>
									</div>
								</Card>

								<UserDetails
									className={styles.userDetails}
									user={user}
								/>

								{/* Show upload button if logged in */}
								{userIsLoggedIn && (
									<SetAvatarButton user={user} />
								)}

								{/* Show statistcs if logged in */}
								{userIsLoggedIn && (
									<>
										<UserStatistics user={user} />
										<div className={styles.uploadWrapper}>
											<Button
												title="Sign out"
												onClick={() => signOut()}
												className={styles.signOut}
											/>
										</div>
									</>
								)}
							</>
						) : (
							<p>
								Could not fetch profile data.{" "}
								<TextButton
									title="Refresh"
									onClick={() => {
										router.reload();
									}}
								/>
							</p>
						)}
					</>
				)}
			</section>
		</Layout>
	);
}

function SetAvatarButton(user) {
	function handleUpload(result, widget) {
		console.log(result, widget);
		if (result.event === "success") {
			setAvatar(user._id, result.info.secure_url).then((res) => {
				if (res.success) {
					console.log("SUCCESS YAY");
				}
			});
		} else {
			console.log("Error uploading image");
		}
	}

	function handleError(error) {
		console.log(error);
	}

	return (
		<div className={styles.uploadWrapper}>
			<CldUploadButton
				uploadPreset="zpeljxi4"
				onUpload={handleUpload}
				onError={handleError}
				className={styles.uploadButton}>
				Upload Profile Photo
			</CldUploadButton>
		</div>
	);
}
