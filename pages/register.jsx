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

	// Form States
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	function handleRegister(e) {
		setLoading(true);

		// Check all fields are filled
		if (!name || !email || !password || !passwordConfirm) {
			setError("Please fill in all fields");
			setLoading(false);
			return;
		}

		// Check passwords match
		if (password !== passwordConfirm) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		// Encrypt password
		// TO DO
		// const hashedPassword = ;

		fetch("/api/users/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				password: password,
				email: email,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					// Login user
					const signInRes = signIn("credentials", {
						redirect: false,
						email: email,
						password: password,
					});

					if (signInRes.error) {
						router.push("/login");
						setLoading(false);
						return;
					} else if (signInRes.ok) {
						router.push("/");
						setLoading(false);
						return;
					}
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
					<div className={styles.form}>
						<InputText
							title="Name"
							placeholder="Jeff"
							name="name"
							onChange={(e) => setName(e.target.value)}
						/>
						<InputEmail
							title="Email"
							placeholder="jeff@money.com"
							name="email"
							onChange={(e) => setEmail(e.target.value)}
						/>

						<InputPassword
							title="Password"
							name="password"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<InputPassword
							title="Confirm Password"
							name="passwordConfirm"
							onChange={(e) => setPasswordConfirm(e.target.value)}
						/>

						{error && <p className={styles.error}>{error}</p>}

						<Button
							title="Sign Up"
							className={styles.button}
							loading={loading}
							onClick={handleRegister}
						/>
						<hr />
						<TextButton
							text="Already have an account?"
							title="Login"
							link="/login"
						/>
					</div>
				)}
			</Card>
		</Layout>
	);
}
