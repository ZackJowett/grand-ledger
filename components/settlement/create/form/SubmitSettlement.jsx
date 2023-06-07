import Card from "components/card/Card";
import styles from "./SubmitSettlement.module.scss";
import TextWithTitle from "components/text/title/TextWithTitle";
import { InputText } from "components/forms/Input";
import { useState, useEffect } from "react";
import Money from "components/text/money/Money";

export default function SubmitSettlement({ selectedUser, stats }) {
	if (!selectedUser) return null;

	const [description, setDescription] = useState("");

	return (
		<>
			<Card
				title="Confirm Settlement"
				subtitle={`Create Settlement for ${selectedUser.name}'s approval`}>
				<div className={styles.wrapper}>
					<div>
						<TextWithTitle
							title={`You have to pay ${selectedUser.name}`}
							tiny
							align="left"
						/>
						<Money amount={stats.net} notColoured />
						<TextWithTitle tiny align="left" />
					</div>
					<InputText
						title="Description"
						placeholder="Settling our debts for movies, lunch..."
						required
						dark
					/>
					<hr />
				</div>
			</Card>
		</>
	);
}
