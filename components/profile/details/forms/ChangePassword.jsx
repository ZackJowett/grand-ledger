import TextWithTitle from "components/text/title/TextWithTitle";
import TextButton from "components/button/text/TextButton";
import { useSession } from "next-auth/react";
import styles from "./ChangeForm.module.scss";
import { useState } from "react";
import { InputPassword } from "components/forms/Input";
import Button from "components/button/Button";
import Spinner from "components/placeholders/spinner/Spinner";
import { updatePassword } from "utils/data/users";
import { useRouter } from "next/router";

export default function ChangeEmail({ user }) {
	const router = useRouter();
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(null);
	const [password, setPassword] = useState("");
	const [passwordMatch, setPasswordMatch] = useState(true);

	function handleForm(e) {
		e.preventDefault();
		setLoading(true);
		setSuccess(null);

		// Check passwords match
		if (
			e.target["new-password"].value !==
			e.target["confirm-password"].value
		) {
			setPasswordMatch(false);
			setSuccess(false);
			setLoading(false);
			return;
		} else {
			setPasswordMatch(true);
		}

		updatePassword(user.email, e.target["new-password"].value).then(
			(res) => {
				if (res.success) {
					setSuccess(true);
					setEditMode(false);
					router.reload();
				} else {
					setSuccess(false);
				}
				setLoading(false);
			}
		);
	}

	if (editMode) {
		return (
			<section className={styles.wrapper}>
				{success === false && (
					<p className={styles.error}>
						{!passwordMatch
							? "Passwords do not match"
							: "Error saving. Please try again"}
					</p>
				)}

				<form className={styles.form} onSubmit={handleForm}>
					<InputPassword
						name={"new-password"}
						placeholder="New Password"
						wrapperClassName={styles.input}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
					{password.length > 0 && (
						<InputPassword
							name={"confirm-password"}
							placeholder="Confirm Password"
							wrapperClassName={styles.input}
						/>
					)}
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
						title="Update Password"
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
