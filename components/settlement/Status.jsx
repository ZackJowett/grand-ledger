import styles from "./Status.module.scss";
import Card from "components/card/Card";
import { useSession } from "next-auth/react";
import Button from "components/button/Button";
import TextWithTitle from "components/text/title/TextWithTitle";
import { IoWarning } from "react-icons/io5";

export default function Status({ settlement, otherPartyName }) {
	const { data: session } = useSession();

	// Settlement is open
	if (settlement.status == "open") {
		if (settlement.settler == session.user.id) {
			// User is settler, therefore need to resubmit
			return (
				<Card
					title="Status"
					subtitle={`${otherPartyName} rejected your settlement`}
					dark
					className={styles.statusCard}>
					<div className={styles.resubmitFormWrapper}>
						<div className={styles.warningWrapper}>
							<p className={styles.warning}>
								<IoWarning className={styles.warningIcon} />{" "}
								Ensure you sent the right amount
							</p>
							<p className={styles.warning}>
								<IoWarning className={styles.warningIcon} />{" "}
								Contact {otherPartyName} for reasoning
							</p>
						</div>
						<form
							onSubmit={handleResubmitForm}
							className={styles.resubmitForm}>
							<Button title="RESUBMIT" submit />
							<p className={styles.underButtonText}>
								<strong>Reject</strong> Settlement and ask{" "}
								{otherPartyName} to resubmit
							</p>
						</form>
					</div>
				</Card>
			);
		}

		// User is settlee, they are waiting for resubmission

		return (
			<Card
				title="Status"
				subtitle="You rejected this settlement"
				dark
				className={styles.statusCard}>
				<TextWithTitle
					title={`Waiting on ${otherPartyName} to resubmit`}
					align="left"
					className={styles.pendingWaiting}
					tiny
				/>
				<form onSubmit={handleNudgeForm} className={styles.nudgeForm}>
					<Button
						title="NUDGE"
						className={styles.nudgeButton}
						submit
					/>
					<p className={styles.underButtonText}>
						Send a gentle reminder to {otherPartyName}
					</p>
				</form>
			</Card>
		);
	}

	// Settlement is pending
	if (settlement.status == "pending") {
		if (settlement.settler == session.user.id) {
			// User is settler, therefore waiting for other party to approve
			return (
				<Card
					title="Status"
					subtitle="There is nothing else to do"
					dark
					className={styles.statusCard}>
					<TextWithTitle
						title={`Waiting on ${otherPartyName}`}
						align="left"
						className={styles.pendingWaiting}
						tiny
					/>
					<form
						onSubmit={handleNudgeForm}
						className={styles.nudgeForm}>
						<Button
							title="NUDGE"
							className={styles.nudgeButton}
							submit
						/>
						<p className={styles.underButtonText}>
							<strong>Reject</strong> Settlement and ask{" "}
							{otherPartyName} to resubmit
						</p>
					</form>
				</Card>
			);
		}

		// User is settlee, they must revice the settlement
		return (
			<Card
				title="Review Settlement"
				subtitle="Check the following"
				dark
				className={styles.statusCard}>
				<form className={styles.reviewForm} onSubmit={handleReviewForm}>
					<div>
						<input type="checkbox" id="received" name="received" />
						<label for="received">I have received payment</label>
					</div>

					<div>
						<input type="checkbox" id="details" name="details" />
						<label for="details">
							I have reviewed the settlement details
						</label>
					</div>

					<div>
						<input type="checkbox" id="paid" name="paid" />
						<label for="paid">I accept the amount paid</label>
					</div>
					<div className={styles.submitWrapper}>
						<TextWithTitle
							text="Submit Verdict"
							align="left"
							className={styles.submitTitle}
						/>

						<Button
							title="APPROVE"
							className={styles.approveButton}
							submit
						/>
						<p className={styles.underButtonText}>
							<strong>Close</strong> Settlement and included Debts
						</p>

						<Button
							title="REJECT"
							className={styles.rejectButton}
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

	// Settlement is closed
	return null;
}

function handleResubmitForm(e) {
	e.preventDefault();
	console.log("Resubmitting...");
}

function handleNudgeForm(e) {
	e.preventDefault();
	console.log("Nudging...");
}

function handleReviewForm(e) {
	e.preventDefault();
	console.log("Review form submitted");
}
