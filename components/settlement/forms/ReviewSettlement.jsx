import Card from "components/card/Card";
import Button from "components/button/Button";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./ReviewSettlement.module.scss";
import { useEffect, useState } from "react";
import { closeSettlement, reopenSettlement } from "/utils/data/settlements";
import { set } from "mongoose";

export default function ReviewSettlement({ settlement, otherPartyName }) {
	const [received, setReceived] = useState(false);
	const [details, setDetails] = useState(false);
	const [paid, setPaid] = useState(false);
	const [approved, setApproved] = useState(false);
	const [formValid, setFormValid] = useState(true);
	const [formInvalidRetries, setFormInvalidRetries] = useState(0); // increase number of '!' if trying to resubmit
	const [reason, setReason] = useState("");

	useEffect(() => {
		// Continously update formValid until all checkboxes are ticked
		if (formValid) return; // Form is valid or not submitted yet

		if (received && details && paid) {
			setFormValid(true);
		}
	}, [received, details, paid, formValid]);

	async function handleReviewForm(e) {
		e.preventDefault();

		// Form is valid
		if (approved) {
			// User has approved the settlement
			// Close settlement
			// Check all boxes are ticked
			if (!received || !details || !paid) {
				if (!formValid) {
					// Form is already not valid, increase number of '!' after warning
					setFormInvalidRetries(formInvalidRetries + 1);
				}

				// Form is valid or not submitted yet
				setFormValid(false);
				return;
			} else {
				// Form is valid
				closeSettlement(settlement._id);
			}
		} else {
			// User has rejected the settlement
			// Reopen settlement
			if (reason == "") {
				alert(
					`Please enter a reason for rejecting this settlement with ${otherPartyName}`
				);
				return;
			}

			const data = await reopenSettlement(settlement._id, reason);
			console.log("DATAAA: ", data);
		}

		console.log("Review form submitted");
	}

	return (
		<Card
			title="Review Settlement"
			subtitle="Check the following"
			dark
			className={styles.statusCard}>
			<form className={styles.reviewForm} onSubmit={handleReviewForm}>
				<div>
					<input
						type="checkbox"
						id="received"
						name="received"
						onChange={() => setReceived(!received)}
					/>
					<label for="received">I have received payment</label>
				</div>

				<div>
					<input
						type="checkbox"
						id="details"
						name="details"
						onChange={() => setDetails(!details)}
					/>
					<label for="details">
						I have reviewed the settlement details
					</label>
				</div>

				<div>
					<input
						type="checkbox"
						id="paid"
						name="paid"
						onChange={() => setPaid(!paid)}
					/>
					<label for="paid">I accept the amount paid</label>
				</div>

				{!formValid && (
					<p className={styles.warning}>
						Please verify and check all requirements to submit
						{formInvalidRetries > 0 &&
							"!".repeat(formInvalidRetries)}
					</p>
				)}
				<div className={styles.submitWrapper}>
					<TextWithTitle
						text="Submit Verdict"
						align="left"
						className={styles.submitTitle}
					/>

					<Button
						title="APPROVE"
						className={styles.approveButton}
						onClick={() => setApproved(true)}
						submit
					/>
					<p className={styles.underButtonText}>
						<strong>Close</strong> Settlement and included Debts
					</p>

					<input
						type="text"
						id="reason"
						name="reason"
						placeholder="Reason for rejection"
						onChange={(e) => setReason(e.target.value)}
					/>
					<Button
						title="REJECT"
						className={styles.rejectButton}
						onClick={() => setApproved(false)}
						submit
					/>
					<p className={styles.underButtonText}>
						<strong>Reject</strong> Settlement and ask{" "}
						{otherPartyName} to resubmit
					</p>
				</div>
			</form>
		</Card>
	);
}

function handleReviewForm(e) {
	e.preventDefault();
	console.log("Review form submitted");
}