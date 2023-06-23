import Card from "/components/card/Card";
import TextWithTitle from "/components/text/title/TextWithTitle";
import Button from "/components/button/Button";
import styles from "./LoggedOut.module.scss";
import FullScreen from "/components/layouts/FullScreen";
import { useSession } from "next-auth/react";
import Spinner from "/components/placeholders/spinner/Spinner";
import Layout from "/components/layouts/Layout";

export default function LoggedOut() {
	const { data: session, status: sessionStatus } = useSession();

	// User not logged in
	if (sessionStatus == "loading") {
		return (
			<Layout>
				<Spinner />
			</Layout>
		);
	}

	return (
		<FullScreen>
			<Card className={styles.wrapper}>
				<TextWithTitle
					title="You are logged out"
					text="Login to use features"
				/>
				<div className={styles.buttons}>
					<Button
						title="Login"
						href="/login"
						className={styles.button}
					/>
					<Button
						title="Sign Up"
						href="/register"
						className={styles.button}
						secondary
					/>
				</div>
			</Card>
		</FullScreen>
	);
}
