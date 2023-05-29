import Card from "components/card/Card";
import styles from "./UserDetails.module.scss";
import TextWithTitle from "components/text/title/TextWithTitle";
import TextButton from "../../button/text/TextButton";

export default function UserDetails({ className, user }) {
	return (
		<Card dark className={`${className ? className : ""}`}>
			<div className={styles.details}>
				<TextWithTitle
					title={user.username}
					text="Username"
					align="left"
					reverse
					tiny
				/>
				<div>
					<TextWithTitle
						title={user.email}
						text="Email"
						align="left"
						reverse
						tiny
					/>
					<TextButton
						title="Change email"
						link="profile/change-email"
						className={styles.change}
					/>
				</div>

				<div>
					<TextWithTitle text="Password" align="left" reverse tiny />
					<TextButton
						title="Change password"
						link="profile/change-password"
						className={styles.change}
					/>
				</div>
			</div>
		</Card>
	);
}
