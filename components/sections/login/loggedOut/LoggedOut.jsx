import Card from "/components/card/Card";
import TextWithTitle from "/components/text/title/TextWithTitle";
import Button from "/components/button/Button";
import styles from "./LoggedOut.module.scss";
import FullScreen from "/components/layouts/FullScreen";
import { useSession } from "next-auth/react";
import Spinner from "/components/placeholders/spinner/Spinner";
import Layout from "/components/layouts/Layout";

export default function LoggedOut() {
	return (
		<Card className={styles.wrapper} dark>
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
