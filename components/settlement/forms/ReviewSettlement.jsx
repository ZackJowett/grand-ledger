import Card from "components/card/Card";
import Button from "components/button/Button";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./ReviewSettlement.module.scss";
import { useEffect, useState } from "react";
import { closeSettlement, reopenSettlement } from "/utils/data/settlements";
import Spinner from "components/placeholders/spinner/Spinner";
import { useRouter } from "next/router";

export default function ReviewSettlement({ settlement, otherPartyName }) {
	const router = useRouter();

	const [received, setReceived] = useState(false);
	const [details, setDetails] = useState(false);
	const [paid, setPaid] = useState(false);
	const [approved, setApproved] = useState(false);
	const [formValid, setFormValid] = useState(true);
	const [formInvalidRetries, setFormInvalidRetries] = useState(0); // increase number of '!' if trying to resubmit
	const [reason, setReason] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Continously update formValid until all checkboxes are ticked
		if (formValid) return; // Form is valid or not submitted yet

		if (received && details && paid) {
			setFormValid(true);
		}
	}, [received, details, paid, formValid]);

	async function handleReviewForm(e) {
		e.preventDefault();
		setLoading(true);

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
				setLoading(false);
				return;
			} else {
				// Form is valid
				closeSettlement(settlement._id);
				router.reload();
			}
		} else {
			// User has rejected the settlement
			// Reopen settlement
			if (reason == "") {
				alert(
					`Please enter a reason for rejecting this settlement with ${otherPartyName}`
				);
				setLoading(false);
				return;
			}

			await reopenSettlement(settlement._id, reason).then((data) => {
				if (data) {
					router.reload();
				} else {
					router.reload();
				}
			});
		}
	}

	return (
		<Card
			title="Review Settlement"
			subtitle="Check the following"
			dark
			className={styles.statusCard}>
			{loading ? (
				<Spinner title={loading} />
			) : (
				<form className={styles.reviewForm} onSubmit={handleReviewForm}>
					<div className={styles.checkboxWrapper}>
						<input
							type="checkbox"
							id="received"
							name="received"
							onChange={() => setReceived(!received)}
						/>
						<label for="received">I have received payment</label>
					</div>

					<div className={styles.checkboxWrapper}>
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

					<div className={styles.checkboxWrapper}>
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
							text="Submit Settlement"
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

						<h4 className={styles.or}>OR</h4>

						<TextWithTitle
							text="Reject Settlement"
							align="left"
							className={styles.submitTitle}
						/>
						<input
							type="text"
							id="reason"
							name="reason"
							placeholder="Reason for rejection"
							maxLength={100}
							onChange={(e) => setReason(e.target.value)}
							className={styles.rejectReason}
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
			)}
		</Card>
	);
}
