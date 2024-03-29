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
				<p>- Groups</p>
				<p>- Light mode</p>
				<p>- Email Notifications</p>
				<p>- Profile Photos</p>
				<p>- Revamped Create Debt</p>
			</Card>
			<Card
				title="Create Settlement & QOL"
				subtitle="v1.2 - Current"
				badge="Sat 19 Aug 2023"
				dark>
				<br />
				<p>- Redesigned Create Settlement page</p>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;- Current standings in dropdown</p>
				<p>
					&nbsp;&nbsp;&nbsp;&nbsp;- Shows existing settlements (if
					any)
				</p>
				<p>- Direct link to settle with someone</p>
				<p>- New debt identifier - DDMMYYXXXX (only with new debts)</p>
				<p>- Simplified Debt & Settlement Cards</p>
				<p>- Profile photos pushed to later release</p>
				<p>- Styling changes</p>
				<p>- Responsiveness improvements</p>
			</Card>
			<Card
				title="Notifications & Logo"
				subtitle="v1.1"
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
