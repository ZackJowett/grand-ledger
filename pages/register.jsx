import Layout from "components/layouts/Layout";
import Card from "components/card/Card";
import styles from "public/styles/pages/Register.module.scss";
import Button from "components/button/Button";
import TextButton from "components/button/text/TextButton";
import { InputText, InputEmail, InputPassword } from "components/forms/Input";
import { signIn } from "next-auth/react";
import { hash } from "utils/password";
import { useState } from "react";
import Spinner from "components/placeholders/spinner/Spinner";
import { useRouter } from "next/navigation";

export default function Register() {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	function handleRegister(e) {
		e.preventDefault();
		setLoading(true);

		const name = e.target.name.value;
		const email = e.target.email.value;
		const unHashedPassword = e.target.password.value;
		const passwordConfirm = e.target.passwordConfirm.value;

		// Check all fields are filled
		if (!name || !email || !unHashedPassword || !passwordConfirm) {
			setError("Please fill in all fields");
			setLoading(false);
			return;
		}

		// Check passwords match
		if (unHashedPassword !== passwordConfirm) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		// Encrypt password
		// TO DO
		const hashedPassword = unHashedPassword;

		fetch("/api/users/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				password: hashedPassword,
				email: email,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					// Login user
					signIn("credentials", {
						email: email,
						password: unHashedPassword,
						callbackUrl: "/",
					});
				} else {
					console.log(data);
					setError(data.message);
					setLoading(false);
				}
			});
	}

	return (
		<Layout>
			<Card title="Sign Up" dark className={styles.wrapper}>
				{loading ? (
					<Spinner />
				) : (
					<form onSubmit={handleRegister} className={styles.form}>
						<InputText
							title="Name"
							placeholder="Jeff"
							name="name"
						/>
						<InputEmail
							title="Email"
							placeholder="jeff@money.com"
							name="email"
						/>

						<InputPassword title="Password" name="password" />
						<InputPassword
							title="Confirm Password"
							name="passwordConfirm"
						/>

						{error && <p className={styles.error}>{error}</p>}

						<Button
							title="Sign Up"
							submit
							className={styles.button}
							loading={loading}
						/>
						<hr />
						<TextButton
							text="Already have an account?"
							title="Login"
							link="/login"
						/>
					</form>
				)}
			</Card>
		</Layout>
	);
}
