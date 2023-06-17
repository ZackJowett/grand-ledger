import { signIn, getProviders } from "next-auth/react";
import Card from "components/card/Card";
import styles from "public/styles/pages/Login.module.scss";
import Button from "components/button/Button";
import TextButton from "components/button/text/TextButton";
import { InputEmail, InputPassword } from "components/forms/Input";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import TextWithTitle from "components/text/title/TextWithTitle";
import Spinner from "components/placeholders/spinner/Spinner";
import { useState } from "react";
import { useSession } from "next-auth/react";

// Get Providers for login
export const getServerSideProps = async () => {
	const providers = await getProviders();
	return { props: { providers } };
};

export default function Login({ providers }) {
	const router = useRouter();
	const { data: session, status } = useSession();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// If authenticated, redirect to home page
	if (status == "authenticated") {
		// setLoading(true);
		router.push("/");
	}

	// Handle login
	const handleLogin = async (e) => {
		e.preventDefault();

		// Validate form
		const email = e.target.email.value;
		const password = e.target.password.value;
		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		setLoading(true);

		const response = await signIn("credentials", {
			redirect: false,
			email: email,
			password: password,
			// callbackUrl: "/",
		});

		if (response.error) {
			console.log(response.error);
			setError("Incorrect Login Details");
			setLoading(false);
			return;
		}

		// If successful, redirect to home page
		if (response.ok) {
			router.push("/");
		}
	};

	console.log(providers);

	return (
		<section className={styles.wrapper}>
			{status != "authenticated" && (
				// Hide title & error if authenticated
				<>
					<TextWithTitle title="Login" className={styles.title} />
					{error && <p className={styles.error}>{error}</p>}
				</>
			)}

			<Card className={styles.wrapperCard}>
				{status == "authenticated" ? (
					<Spinner title="Logging in..." />
				) : (
					<form onSubmit={handleLogin} className={styles.form}>
						<Card dark>
							<div className={styles.inputElements}>
								<InputEmail title="Email" name="email" />
								<InputPassword
									title="Password"
									name="password"
								/>
								<Button
									title="Login"
									submit
									className={styles.submit}
									loading={loading}
								/>
							</div>
						</Card>

						{providers && (
							<>
								<p className={styles.or}>OR</p>
								{Object.values(providers).map((provider) => {
									if (provider.name === "Credentials") return;
									return (
										<div
											key={provider.name}
											className={styles.provider}>
											<Button
												title={
													<p
														className={
															styles.providerText
														}>
														{/* Icon */}
														{provider.name ===
															"Google" && (
															<FaGoogle
																className={
																	styles.icon
																}
															/>
														)}
														Login with{" "}
														{provider.name}
													</p>
												}
												onClick={() =>
													signIn(provider.id)
												}
											/>
										</div>
									);
								})}
							</>
						)}

						<hr className={styles.hr} />
						<TextButton
							text="Don't have an account?"
							title="Sign Up"
							link="/register"
						/>
					</form>
				)}
			</Card>
		</section>
	);
}
