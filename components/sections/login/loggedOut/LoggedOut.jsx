import Card from "/components/card/Card";
import TextWithTitle from "/components/text/title/TextWithTitle";
import Button from "/components/button/Button";
import { signIn } from "next-auth/react";
import styles from "./LoggedOut.module.scss";

export default function LoggedOut() {
	return (
		<Card className={styles.wrapper}>
			<TextWithTitle
				title="You are logged out"
				text="Login to use features"
			/>
			<div className={styles.buttons}>
				<Button title="Login" href="/login" className={styles.button} />
				<Button
					title="Sign Up"
					href="/register"
					className={styles.button}
					secondary
				/>
			</div>
		</Card>
	);
}
