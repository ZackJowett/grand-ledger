import Card from "components/card/Card";
import styles from "./UserDetails.module.scss";
import TextWithTitle from "components/text/title/TextWithTitle";
import TextButton from "../../button/text/TextButton";
import { useSession } from "next-auth/react";
import ChangePassword from "./forms/ChangePassword";
import ChangeEmail from "./forms/ChangeEmail";

export default function UserDetails({ className, user }) {
	const { data: session } = useSession();

	// Check if current user is logged in user
	const userIsLoggedIn = session && user && session.user.id === user._id;

	return (
		<Card dark className={`${className ? className : ""}`}>
			<div className={styles.details}>
				<div className={styles.row}>
					<TextWithTitle
						title={user.email.toLowerCase()}
						text="Email"
						align="left"
						reverse
						tiny
					/>
					{userIsLoggedIn && <ChangeEmail user={user} />}
				</div>

				{userIsLoggedIn && (
					<div className={styles.row}>
						<TextWithTitle
							text="Password"
							align="left"
							reverse
							tiny
						/>
						<ChangePassword user={user} />
					</div>
				)}
			</div>
		</Card>
	);
}
