import React from "react";
import TextWithTitle from "/components/text/title/TextWithTitle";
import styles from "./Details.module.scss";
import Card from "components/card/Card";
import { useSession } from "next-auth/react";
import { formatDate } from "/utils/helpers";

export default function Details({ settlement, otherPartyName }) {
	const { data: session } = useSession();

	return (
		<Card title="Details" dark className={styles.detailsCard}>
			<div className={styles.details}>
				<TextWithTitle
					text="Description"
					title={settlement.description}
					align="left"
					reverse
					tiny
				/>
				<TextWithTitle
					text="Opened by"
					title={
						settlement.settler == session.user.id
							? "You"
							: otherPartyName
					}
					align="left"
					reverse
					tiny
				/>
				{/* <TextWithTitle
					text="Proof of payment"
					align="left"
					reverse
					tiny
				/> */}
			</div>
		</Card>
	);
}
