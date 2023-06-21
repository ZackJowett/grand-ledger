import { signIn, getProviders } from "next-auth/react";
import Card from "components/card/Card";
import styles from "public/styles/pages/Login.module.scss";
import Button from "components/button/Button";
import TextButton from "components/button/text/TextButton";
import { InputEmail, InputPassword } from "components/forms/Input";
import { useRouter } from "next/navigation";
import { FaGoogle, FaApple } from "react-icons/fa";
import TextWithTitle from "components/text/title/TextWithTitle";
import Spinner from "components/placeholders/spinner/Spinner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

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
			console.log(response);
			router.push("/");
		}
	};

	return (
		<section className={styles.wrapper}>
			{status != "authenticated" && (
				// Hide title & error if authenticated
				<>
					<Image
						src="/images/logo.png"
						width={1000}
						height={1000}
						className={styles.image}
						alt={"Logo"}
					/>
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
								<InputEmail
									title="Email"
									name="email"
									placeholder=""
								/>
								<InputPassword
									title="Password"
									name="password"
									placeholder=""
								/>
								<Button
									title="Login"
									submit
									className={styles.submit}
									loading={loading}
								/>
							</div>
						</Card>

						{/* {providers && (
							<>
								<p className={styles.or}>OR</p>
								{Object.values(providers).map((provider) => {
									if (provider.name === "Credentials") return;
									return (
										<div
											key={provider.name}
											className={styles.provider}>
											<Button
												icon={getProviderIcon(
													provider.name
												)}
												title={`Login with ${provider.name}`}
												onClick={() =>
													signIn(provider.id)
												}
												alignIcon="left"
											/>
										</div>
									);
								})}
							</>
						)} */}

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

function getProviderIcon(provider) {
	switch (provider) {
		case "Google":
			return <FaGoogle className={styles.icon} />;
		case "Apple":
			return <FaApple className={styles.icon} />;
		default:
			return null;
	}
}
