import { signIn } from "next-auth/react";
import Layout from "components/layouts/Layout";
import Card from "components/card/Card";
import styles from "public/styles/pages/Login.module.scss";
import Button from "components/button/Button";
import { InputEmail, InputPassword } from "components/forms/Input";

export default function Login() {
	const handleLogin = async (e) => {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;
		const loginInfo = { email, password };

		signIn("credentials", {
			email: email,
			password: password,
			callbackUrl: "/",
		});

		const loginResponse = await login.json();
		console.log(loginResponse);
	};

	return (
		<Layout>
			<Card title="Login" dark className={styles.wrapper}>
				<form onSubmit={handleLogin} className={styles.form}>
					<InputEmail title="Email" name="email" />
					<InputPassword title="Password" name="password" />
					<Button title="Login" submit />
					<hr />
					<p className={styles.login}>Don't have an account?</p>
					<Button title="Sign Up" href="/register" secondary />
				</form>
			</Card>
		</Layout>
	);
}
