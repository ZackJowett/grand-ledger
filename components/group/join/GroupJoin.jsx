import { InputText } from "components/forms/Input";
import Button from "components/button/Button";
import styles from "./GroupJoin.module.scss";
import Card from "components/card/Card";
import { toast } from "utils/toasts";
import { joinGroup } from "utils/data/groups";
import { useState } from "react";
import Spinner from "components/placeholders/spinner/Spinner";
import { useRouter } from "next/router";

export default function GroupJoin({ user }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [code, setCode] = useState("");

	function handleJoin() {
		setLoading(true);

		// CLean code input
		setCode(code.trim().toUpperCase());

		// Validate code
		if (code.length !== 8) {
			toast(
				false,
				false,
				{
					error: "Invalid code",
				},
				true
			);
			setLoading(false);
			return;
		}

		// Join group
		toast(joinGroup(user.id, code), false, {
			pending: "Joining group...",
			success: "Joined Group! Refreshing...",
			error: "Failed to join group",
		}).then((res) => {
			setLoading(false);
			if (res && res.success) {
				setTimeout(() => {
					window.location.reload();
				}, 500);
			}
		});
	}

	return (
		<Card action="Join Group" reverseAction>
			<div className={styles.wrapper}>
				<InputText
					placeholder="Join code"
					onChange={(e) => setCode(e.target.value)}
					maxLength={8}
				/>
				<Button
					title={loading ? <Spinner /> : `Join`}
					className={styles.button}
					onClick={handleJoin}
					disabled={loading}
				/>
			</div>
		</Card>
	);
}
