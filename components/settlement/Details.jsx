import React from "react";
import TextWithTitle from "/components/text/title/TextWithTitle";
import styles from "./Details.module.scss";
import Card from "components/card/Card";
import { useSession } from "next-auth/react";
import { formatDate } from "/utils/helpers";

export default function Details({ settlement, otherPartyName }) {
	const { data: session } = useSession();

	return (
		<Card dark>
			<div className={styles.details}>
				<TextWithTitle
					text="Description"
					title={settlement.description}
					align="left"
					reverse
					tiny
				/>
				<hr className={styles.hr} />
				<TextWithTitle
					text={`Opened by ${
						settlement.creator == session.user.id
							? "You"
							: otherPartyName
					}`}
					title={formatDate(settlement.dateCreated)}
					align="left"
					reverse
					tiny
				/>

				{settlement.dateReopened && (
					<TextWithTitle
						text="Rejected"
						title={formatDate(settlement.dateReopened)}
						align="left"
						reverse
						tiny
					/>
				)}

				{settlement.dateClosed && (
					<TextWithTitle
						text="Closed"
						title={formatDate(settlement.dateClosed)}
						align="left"
						reverse
						tiny
					/>
				)}
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
