import { useSession } from "next-auth/react";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import TextWithTitle from "components/text/title/TextWithTitle";
import Card from "components/card/Card";
import styles from "public/styles/pages/Updates.module.scss";

export default function Updates() {
	const { data: session, status: sessionStatus } = useSession();

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	return (
		<Layout>
			<section className={styles.wrapper}>
				<TextWithTitle
					title="Updates"
					text="New features!"
					align="left"
					className={styles.title}
				/>
				<Card
					title="Notifications & Logo"
					subtitle="v1.1"
					badge="Thu 6 July 2023"
					dark>
					<ul className={styles.ul}>
						<li>- New notification center</li>
						<li>- New logo!</li>
						<li>- Nudging to send a reminder to someone</li>
						<li>- Minor styling changes</li>
					</ul>
				</Card>
				<Card
					title="Launch"
					subtitle="v1.0"
					badge="Mon 3 July 2023"
					dark></Card>
			</section>
		</Layout>
	);
}
