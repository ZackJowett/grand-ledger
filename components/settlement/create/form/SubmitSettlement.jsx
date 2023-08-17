import Card from "components/card/Card";
import styles from "./SubmitSettlement.module.scss";
import Title from "components/text/title/TextWithTitle";
import { InputText } from "components/forms/Input";
import { useState, useEffect } from "react";
import Money from "components/text/money/Money";
import Checkbox from "components/forms/Checkbox";
import Button from "components/button/Button";

export default function SubmitSettlement({
	selectedUser,
	stats,
	handleSubmit,
	debtsIncluded,
}) {
	const [description, setDescription] = useState("");
	const [checkedApprove, setCheckedApprove] = useState(false);
	const [checkedSent, setCheckedSent] = useState(false);
	const [formValid, setformValid] = useState(true);
	const [formInvalidRetries, setFormInvalidRetries] = useState(0); // increase number of '!' if trying to resubmit

	if (!selectedUser) return null;

	// Total amount to pay from debtsIncluded
	const totalAmount = debtsIncluded
		? debtsIncluded.reduce((total, debt) => {
				// check if user is creditor
				if (debt.creditor == selectedUser._id) {
					return total + debt.amount;
				}

				return total - debt.amount;
		  }, 0)
		: null;

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
			<Card>
				<div className={styles.wrapper}>
					<Title title="Confirm Settlement" align="left" />
					<div className={styles.stats}>
						<Card
							className={styles.debtsIncluded}
							action="Debts Included"
							reverseAction
							light>
							<h2 className={styles.text}>
								{debtsIncluded ? debtsIncluded.length : "---"}
							</h2>
						</Card>
						<Card
							className={styles.debtsIncluded}
							action="Amount to Pay"
							reverseAction
							light>
							{totalAmount === null ? (
								<p className={styles.text}>---</p>
							) : totalAmount < 0 ? (
								<p className={styles.text}>You owe nothing</p>
							) : totalAmount == 0 ? (
								<p className={styles.text}>Nothing owed</p>
							) : (
								<Money amount={totalAmount} notColoured />
							)}
						</Card>
					</div>

					{totalAmount > 0 && (
						<div className={styles.form}>
							<InputText
								title="Description"
								placeholder="Settling our debts for movies, lunch..."
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
							{/* <p className={styles.text}>
								Please pay them now, then submit this settlement
							</p> */}
							<div className={styles.checkboxes}>
								<Checkbox
									label={`I approve the amounts`}
									onChange={(checked, e) =>
										setCheckedApprove(checked)
									}
								/>
								<Checkbox
									label={`I have sent the money to ${selectedUser.name}`}
									onChange={(checked, e) =>
										setCheckedSent(checked)
									}
								/>
							</div>
							{!formValid && (
								<p className={styles.warning}>
									Please ensure all checkboxes are checked and
									a description is provided
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
					)}
				</div>
			</Card>
		</>
	);
}
