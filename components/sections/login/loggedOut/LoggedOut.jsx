import Card from "/components/card/Card";
import TextWithTitle from "/components/text/title/TextWithTitle";
import Button from "/components/button/Button";
import { signIn } from "next-auth/react";
import styles from "./LoggedOut.module.scss";

export default function LoggedOut() {
	return (
		<Card>
			<TextWithTitle
				title="You are logged out"
				text="Login to use features"
			/>
			<Button title="Login" onClick={signIn} className={styles.button} />
			{/* <button onClick={() => signIn()}>Sign in</button> */}
		</Card>
	);
}
