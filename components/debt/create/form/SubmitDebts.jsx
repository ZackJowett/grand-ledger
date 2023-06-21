import Button from "components/button/Button";
import { postDebts } from "utils/data/debts";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styles from "./SubmitDebts.module.scss";

export default function SubmitDebts({
	debts,
	setSubmitting,
	setSubmitError,
	setSubmitSuccess,
	setDebts,
}) {
	const { data: session } = useSession();

	const [confirmSubmission, setConfirmSubmission] = useState(false);

	function handleSubmit() {
		// Set states
		setSubmitting(true);

		// Submit debts
		postDebts(debts, session.user.id).then((data) => {
			// Check if error
			if (!data.success) {
				// Error submitting
				setSubmitError(data.error);
				setSubmitSuccess(false);
				setSubmitting(false);
			} else {
				// Success submitting
				setDebts([]);
				setSubmitSuccess(true);
				setSubmitError(false);
				setSubmitting(false);

				console.log("Success submitting", data);
			}
		});
	}

	if (confirmSubmission) {
		return (
			<div className={styles.wrapper}>
				<p className={styles.text}>Are you sure?</p>
				<div className={styles.confirmButtons}>
					<Button
						title="Confirm"
						onClick={handleSubmit}
						className={styles.yes}
					/>
					<Button
						title="Cancel"
						onClick={() => setConfirmSubmission(false)}
						className={styles.no}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.wrapper}>
			<Button
				title="Submit All"
				onClick={() => setConfirmSubmission(true)}
			/>
		</div>
	);
}
