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
	totalNumDebts,
}) {
	const [description, setDescription] = useState("");
	const [checkedApprove, setCheckedApprove] = useState(false);
	const [checkedSent, setCheckedSent] = useState(false);
	const [formValid, setformValid] = useState({
		description: true,
		checkedApprove: true,
		checkedSent: true,
	});
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
		let newFormValid = { ...formValid };

		console.log(checkedApprove, checkedSent, description);

		if (!checkedApprove) {
			newFormValid.checkedApprove = false;
		} else {
			newFormValid.checkedApprove = true;
		}
		if (!checkedSent) {
			newFormValid.checkedSent = false;
		} else {
			newFormValid.checkedSent = true;
		}
		if (!description || description.length <= 0) {
			newFormValid.description = false;
		} else {
			newFormValid.description = true;
		}

		setformValid(newFormValid);

		console.log(newFormValid);

		if (!checkedApprove || !checkedSent || !description) {
			setFormInvalidRetries(formInvalidRetries + 1);
			return;
		} else {
			setFormInvalidRetries(0);
		}

		if (debtsIncluded && debtsIncluded.length <= 0) {
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
								{debtsIncluded
									? `${debtsIncluded.length} / ${
											totalNumDebts ? totalNumDebts : "--"
									  }`
									: "---"}
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
								invalid={!formValid.description}
							/>
							{/* <p className={styles.text}>
								Please pay them now, then submit this settlement
							</p> */}
							<div className={styles.checkboxes}>
								<Checkbox
									label={`I approve the amount of $${totalAmount}`}
									onChange={(checked, e) =>
										setCheckedApprove(checked)
									}
									invalid={!formValid.checkedApprove}
								/>
								<Checkbox
									label={`I have sent $${totalAmount} to ${selectedUser.name}`}
									onChange={(checked, e) =>
										setCheckedSent(checked)
									}
									invalid={!formValid.checkedSent}
								/>
							</div>
							{!formValid.checkedApprove ||
							!formValid.checkedSent ||
							!formValid.description ? (
								<p className={styles.warning}>
									Please ensure all checkboxes are checked and
									a description is provided
									{formInvalidRetries > 0 &&
										"!".repeat(formInvalidRetries)}
								</p>
							) : null}
							<Button
								title="Submit"
								className={styles.submit}
								onClick={verifySubmit}
							/>
						</div>
					)}
				</div>
			</Card>
		</>
	);
}
