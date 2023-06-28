import TextWithTitle from "components/text/title/TextWithTitle";
import TextButton from "components/button/text/TextButton";
import { useSession } from "next-auth/react";
import styles from "./ChangeForm.module.scss";
import { useState } from "react";
import { InputText } from "components/forms/Input";
import Button from "components/button/Button";
import Spinner from "components/placeholders/spinner/Spinner";
import { updateEmail } from "utils/data/users";
import { useRouter } from "next/router";

export default function ChangeEmail({ user }) {
	const router = useRouter();
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(null);

	function handleForm(e) {
		e.preventDefault();
		setLoading(true);

		updateEmail(user.email, e.target["new-email"].value).then((res) => {
			if (res.success) {
				setSuccess(true);
				setEditMode(false);
				router.reload();
			} else {
				setSuccess(false);
			}
			setLoading(false);
		});
	}

	if (editMode) {
		return (
			<section className={styles.wrapper}>
				{success === false && (
					<p className={styles.error}>
						Error saving. Please try again
					</p>
				)}

				<form className={styles.form} onSubmit={handleForm}>
					<InputText
						name={"new-email"}
						placeholder="New Email"
						wrapperClassName={styles.input}
					/>
					<div className={styles.buttons}>
						<Button
							title={
								!loading ? (
									"Save"
								) : (
									<Spinner
										spinnerClassName={styles.spinner}
									/>
								)
							}
							submit
							className={styles.button}
						/>
						<Button
							title="Cancel"
							onClick={() => setEditMode(false)}
							className={styles.button}
							secondary
						/>
					</div>
				</form>
			</section>
		);
	} else {
		return (
			<>
				{success === null ? (
					<TextButton
						title="Update Email"
						onClick={() => setEditMode(true)}
						className={styles.change}
					/>
				) : (
					success === true && (
						<p className={styles.success}>Success! Refreshing...</p>
					)
				)}
			</>
		);
	}
}
