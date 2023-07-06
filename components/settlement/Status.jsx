import styles from "./Status.module.scss";
import Card from "components/card/Card";
import { useSession } from "next-auth/react";
import Button from "components/button/Button";
import TextWithTitle from "components/text/title/TextWithTitle";
import { IoWarning } from "react-icons/io5";
import ReviewSettlement from "./forms/ReviewSettlement";
import { resubmitSettlement } from "/utils/data/settlements";
import { useState } from "react";
import Spinner from "components/placeholders/spinner/Spinner";
import { useRouter } from "next/router";
import NudgeButton from "components/button/nudge/NudgeButton";

export default function Status({ settlement, otherPartyName }) {
	const { data: session } = useSession();
	const router = useRouter();

	const [loading, setLoading] = useState(null);
	const [success, setSuccess] = useState(null); // ["success", "error"

	// --------- Functions --------- \\
	function handleResubmit() {
		setLoading("Resubmitting...");
		resubmitSettlement(settlement._id).then((data) => {
			if (data) {
				setSuccess(true);
			} else {
				setSuccess(false);
			}

			setLoading(null);
			router.reload();
		});
	}

	console.log(settlement.reopenedReason);

	// Settlement is open
	if (settlement.status == "reopened") {
		if (settlement.settler == session.user.id) {
			// User is settler, therefore need to resubmit
			return (
				<>
					<Card
						title="Status"
						subtitle={`${otherPartyName} rejected your settlement`}
						dark
						className={styles.statusCard}>
						{loading ? (
							<Spinner title={loading} />
						) : success === true ? (
							<p>Success! Refreshing...</p>
						) : success === false ? (
							<p>Error, refreshing...</p>
						) : (
							<div className={styles.resubmitFormWrapper}>
								<div className={styles.warningWrapper}>
									<p className={styles.warning}>
										<IoWarning
											className={styles.warningIcon}
										/>
										Ensure you paid the correct amount
									</p>
									<TextWithTitle
										title={`${otherPartyName}'s Reasoning`}
										text={settlement.reopenedReason}
										tiny
										align="left"
									/>
								</div>

								<Button
									title="RESUBMIT"
									onClick={() => handleResubmit()}
								/>
								<p className={styles.underButtonText}>
									<strong>Resubmit</strong> Settlement to{" "}
									{otherPartyName} - ensure you&apos;ve fixed
									issues
								</p>
							</div>
						)}
					</Card>
					<hr className={styles.hr} />
				</>
			);
		}

		// User is settlee, they are waiting for resubmission

		return (
			<>
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

					<div className={styles.nudgeForm}>
						<NudgeButton
							user={settlement.settler}
							name={otherPartyName}
							settlement={settlement._id}
							wide
						/>
						<p className={styles.underButtonText}>
							Send a gentle reminder to {otherPartyName}
						</p>
					</div>
				</Card>
				<hr className={styles.hr} />
			</>
		);
	}

	// Settlement is pending
	if (settlement.status == "pending") {
		if (settlement.settler == session.user.id) {
			// User is settler, therefore waiting for other party to approve
			return (
				<>
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

						<div className={styles.nudgeForm}>
							<NudgeButton
								user={settlement.settlee}
								name={otherPartyName}
								settlement={settlement._id}
								wide
							/>
							<p className={styles.underButtonText}>
								Send a gentle reminder to {otherPartyName}
							</p>
						</div>
					</Card>
					<hr className={styles.hr} />
				</>
			);
		}

		// User is settlee, they must review the settlement
		return (
			<>
				<ReviewSettlement
					settlement={settlement}
					otherPartyName={otherPartyName}
				/>
				<hr className={styles.hr} />
			</>
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
