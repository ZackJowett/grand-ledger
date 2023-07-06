import Button from "components/button/Button";
import { FaHandPointRight } from "react-icons/fa";
import styles from "./NudgeButton.module.scss";
import { useState, useEffect } from "react";
import { createNotification } from "utils/data/notification";
import { useSession } from "next-auth/react";

export default function NudgeButton({
	user,
	name = "",
	wide,
	settlement = null,
}) {
	const { data: session, status: sessionStatus } = useSession();

	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(null);

	function handleNudge() {
		setLoading(true);
		createNotification(
			session.user.id,
			[user],
			settlement ? "settlement-approve-nudge" : "settlement-create-nudge",
			settlement
		).then((data) => {
			if (data.success) {
				setSuccess("success");
			} else {
				if (data.message === "already-created") {
					setSuccess("already-nudged");
				} else {
					console.log(data.message);
					setSuccess("error");
				}
			}
			setLoading(false);
		});
	}

	if (success === "success") {
		return <p>Nudged {name}!</p>;
	} else if (success === "already-nudged") {
		return <p>You have already nudged {name}!</p>;
	} else if (success === "error") {
		return <p>Something went wrong!</p>;
	}

	return (
		<Button
			className={`${styles.nudgeButton} ${wide ? styles.wide : ""}`}
			title={`Nudge${name ? " " + name : ""}`}
			icon={<FaHandPointRight />}
			onClick={handleNudge}
			loading={loading}
		/>
	);
}
