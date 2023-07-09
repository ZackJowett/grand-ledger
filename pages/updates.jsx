import { useSession } from "next-auth/react";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import TextWithTitle from "components/text/title/TextWithTitle";
import Card from "components/card/Card";
import styles from "public/styles/pages/Updates.module.scss";

export default function Updates() {
	const { data: session, status: sessionStatus } = useSession();

	return (
		<section className={styles.wrapper}>
			<TextWithTitle
				title="Updates"
				text="New features!"
				align="left"
				className={styles.title}
			/>

			<Card subtitle="In Development" dark>
				<p>- Profile Photos</p>
				<p>- Email Notifications</p>
				<p>- Create Settlement redesign</p>
			</Card>
			<Card
				title="Notifications & Logo"
				subtitle="v1.1 - Current"
				badge="Thu 6 July 2023"
				dark>
				<br />
				<p>- New notification centre</p>
				<p>- New logo</p>
				<p>- Nudging to send a reminder to someone</p>
				<p>- Updates page</p>
				<p>- Minor styling changes</p>
			</Card>
			<Card
				title="Launch"
				subtitle="v1.0"
				badge="Mon 3 July 2023"
				dark></Card>
		</section>
	);
}
