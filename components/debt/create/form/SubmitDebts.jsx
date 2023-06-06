import Button from "components/button/Button";
import { postDebts } from "utils/data/debts";
import { useSession } from "next-auth/react";

export default function SubmitDebts({
	debts,
	setSubmitting,
	setSubmitError,
	setSubmitSuccess,
	setDebts,
}) {
	const { data: session } = useSession();

	function handleSubmit() {
		// Set states
		setSubmitting(true);

		// Submit debts
		postDebts(debts, session.user.id).then((data) => {
			// Check if error
			if (!data.success) {
				// Error submitting
				setSubmitError(data.error);
				setSubmitting(false);
			} else {
				// Success submitting
				setDebts([]);
				setSubmitSuccess(true);
				setSubmitting(false);

				console.log("Success submitting", data);
			}
		});
	}

	return <Button title="Submit All" onClick={handleSubmit} />;
}
