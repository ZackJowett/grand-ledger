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
import FullScreen from "components/layouts/FullScreen";
import { useSession } from "next-auth/react";
import TextWithTitle from "components/text/title/TextWithTitle";

export default function Register() {
	const router = useRouter();
	const { data: session, status: sessionStatus } = useSession();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Form States
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	// If authenticated, redirect to home page
	if (sessionStatus == "authenticated") {
		// setLoading(true);
		router.push("/");
	}

	function handleRegister(e) {
		setError(null);

		// Check all fields are filled
		if (!name || !email || !password || !passwordConfirm) {
			setError("Please fill in all fields");
			return;
		}

		// Check passwords match
		if (password !== passwordConfirm) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		setLoading(true);

		fetch("/api/users/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				password: password,
				email: email.toLowerCase(),
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					console.log("SUCCESS");
					// Login user
					const signInRes = signIn("credentials", {
						redirect: false,
						email: email,
						password: password,
					});

					if (signInRes.error) {
						router.push("/login");
						return;
					} else if (signInRes.ok) {
						router.push("/");
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
		<FullScreen title="Sign Up">
			{error && <p className={styles.error}>{error}</p>}
			<Card className={styles.wrapper} dark>
				{sessionStatus == "authenticated" ? (
					<Spinner title="Logging in..." />
				) : (
					<Card dark>
						<div className={styles.form}>
							<div className={styles.input}>
								<TextWithTitle
									title="Name"
									text={"Who others will see you as"}
									small
									align="left"
								/>
								<InputText
									placeholder="Jeff"
									name="name"
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className={styles.input}>
								<TextWithTitle
									title="Email"
									text={"You'll use this to sign in"}
									small
									align="left"
								/>
								<InputEmail
									placeholder="jeff@money.com"
									name="email"
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className={styles.input}>
								<TextWithTitle
									title="Password"
									small
									align="left"
								/>
								<InputPassword
									name="password"
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</div>
							{password.length > 0 && (
								<div className={styles.input}>
									<TextWithTitle
										title="Confirm Password"
										small
										align="left"
									/>
									<InputPassword
										name="passwordConfirm"
										onChange={(e) =>
											setPasswordConfirm(e.target.value)
										}
									/>
								</div>
							)}

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
					</Card>
				)}
			</Card>
		</FullScreen>
	);
}
