import Card from "components/card/Card";
import styles from "./SubmitSettlement.module.scss";
import TextWithTitle from "components/text/title/TextWithTitle";
import { InputText } from "components/forms/Input";
import { useState, useEffect } from "react";
import Money from "components/text/money/Money";
import Checkbox from "components/forms/Checkbox";
import Button from "components/button/Button";

export default function SubmitSettlement({
	selectedUser,
	stats,
	handleSubmit,
}) {
	const [description, setDescription] = useState("");
	const [checkedApprove, setCheckedApprove] = useState(false);
	const [checkedSent, setCheckedSent] = useState(false);
	const [formValid, setformValid] = useState(true);
	const [formInvalidRetries, setFormInvalidRetries] = useState(0); // increase number of '!' if trying to resubmit

	if (!selectedUser) return null;

	function verifySubmit() {
		if (!checkedApprove || !checkedSent || !description) {
			setformValid(false);
			setFormInvalidRetries(formInvalidRetries + 1);
			return;
		}

		handleSubmit(description);
	}

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
						onChange={(e) => setDescription(e.target.value)}
						required
						dark
					/>
					<hr />
					<p className={styles.text}>
						Please pay them now, then submit this settlement
					</p>
					<div className={styles.checkboxes}>
						<Checkbox
							label={`I approve the amounts`}
							onChange={(checked, e) =>
								setCheckedApprove(checked)
							}
						/>
						<Checkbox
							label={`I have sent the money to ${selectedUser.name}`}
							onChange={(checked, e) => setCheckedSent(checked)}
						/>
					</div>
					{!formValid && (
						<p className={styles.warning}>
							Please ensure all checkboxes are checked and a
							description is provided
							{formInvalidRetries > 0 &&
								"!".repeat(formInvalidRetries)}
						</p>
					)}
					<Button
						title="Submit"
						className={styles.submit}
						onClick={verifySubmit}
					/>
					<p className={styles.note}>You cannot undo this</p>
				</div>
			</Card>
		</>
	);
}
