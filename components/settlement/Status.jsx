import styles from "./Status.module.scss";
import Card from "components/card/Card";
import { useSession } from "next-auth/react";
import Button from "components/button/Button";
import TextWithTitle from "components/text/title/TextWithTitle";
import { IoWarning } from "react-icons/io5";
import ReviewSettlement from "./forms/ReviewSettlement";
import { resubmitSettlement } from "/utils/data/settlements";

export default function Status({ settlement, otherPartyName }) {
	const { data: session } = useSession();

	console.log(settlement.reopenedReason);

	// Settlement is open
	if (settlement.status == "reopened") {
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
								<IoWarning className={styles.warningIcon} />
								Ensure you paid the correct amount
							</p>
							<TextWithTitle
								title={`${otherPartyName}'s Reasoning`}
								text={settlement.reopenedReason}
								tiny
								align="left"
							/>
						</div>

						<form
							onSubmit={handleResubmitForm}
							className={styles.resubmitForm}>
							<Button
								title="RESUBMIT"
								onClick={() =>
									resubmitSettlement(settlement._id)
								}
							/>
							<p className={styles.underButtonText}>
								<strong>Resubmit</strong> Settlement to{" "}
								{otherPartyName} - ensure you've fixed issues
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
			<ReviewSettlement
				settlement={settlement}
				otherPartyName={otherPartyName}
			/>
		);
	}

	// Settlement is closed
	return null;
}

function handleResubmitForm(e) {
	e.preventDefault();
	console.log(e.target.value);
	// console.log("Resubmitting...");
}

function handleNudgeForm(e) {
	e.preventDefault();
	console.log("Nudging...");
}
