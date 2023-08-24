import { InputText } from "components/forms/Input";
import Button from "components/button/Button";
import styles from "./GroupCreate.module.scss";
import Card from "components/card/Card";
import { toast } from "utils/toasts";
import { createGroup } from "utils/data/groups";
import { useState } from "react";
import Spinner from "components/placeholders/spinner/Spinner";
import { useRouter } from "next/router";
import { globalRevalidate } from "utils/helpers";

export default function GroupCreate({ user }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");

	function handleCreate() {
		setLoading(true);

		// Join group
		toast(createGroup(name, [user.id], [user.id], [user.id]), false, {
			pending: "Creating group...",
			success: "Created Group! Refreshing...",
			error: "Failed to create group",
		}).then((res) => {
			setLoading(false);
			if (res && res.success) {
				router.push(`/groups/${res.data._id}`);
				globalRevalidate();
			}
		});
	}

	return (
		<Card action="Create New Group" reverseAction>
			<div className={styles.wrapper}>
				<InputText
					placeholder="Name"
					onChange={(e) => setName(e.target.value)}
					maxLength={30}
				/>
				<Button
					title={loading ? <Spinner /> : `Create`}
					className={styles.button}
					onClick={handleCreate}
					disabled={loading}
				/>
			</div>
		</Card>
	);
}
