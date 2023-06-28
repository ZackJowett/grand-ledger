import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllBetweenTwoUsers } from "/utils/data/debts";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import styles from "public/styles/pages/CreateSettlement.module.scss";
import TextWithTitle from "/components/text/title/TextWithTitle";
import { useStore } from "react-redux";
import Spinner from "components/placeholders/spinner/Spinner";
import CurrentDebts from "components/settlement/create/CurrentDebts";
import SelectUser from "components/settlement/create/form/SelectUser";
import SubmitSettlement from "components/settlement/create/form/SubmitSettlement";
import Button from "components/button/Button";
import TextButton from "components/button/text/TextButton";
import CreateSettlement from "components/settlement/create/CreateSettlement";

export default function Create() {
	const { data: session, status: sessionStatus } = useSession();

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	return (
		<Layout>
			<section className={styles.wrapper}>
				<TextWithTitle
					title={`Create Settlement`}
					text="Pay outstanding balances to someone"
					className={styles.header}
					align="left"
					large
				/>

				<p className={styles.desc}>
					1. Select someone to settle with
					<br />
					2. Check difference and if you need to pay them <br />
					3. Pay them the difference <br />
					4. Confirm
				</p>
				{/* <CurrentDebts /> */}
				<hr className={styles.hr} />
				<CreateSettlement />
			</section>
		</Layout>
	);
}
