import Card from "components/card/Card";
import styles from "./UserDetails.module.scss";
import TextWithTitle from "components/text/title/TextWithTitle";
import TextButton from "../../button/text/TextButton";
import { useSession } from "next-auth/react";

export default function UserDetails({ className, user }) {
	const { data: session } = useSession();

	// Check if current user is logged in user
	const userIsLoggedIn = session && user && session.user.id === user._id;

	return (
		<Card dark className={`${className ? className : ""}`}>
			<div className={styles.details}>
				<div>
					<TextWithTitle
						title={user.email}
						text="Email"
						align="left"
						reverse
						tiny
					/>
					{userIsLoggedIn && (
						<TextButton
							title="Change email"
							link="profile/change-email"
							className={styles.change}
						/>
					)}
				</div>

				{userIsLoggedIn && (
					<div>
						<TextWithTitle
							text="Password"
							align="left"
							reverse
							tiny
						/>
						<TextButton
							title="Change password"
							link="profile/change-password"
							className={styles.change}
						/>
					</div>
				)}
			</div>
		</Card>
	);
}
