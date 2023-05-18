export default function Login() {
	const handleLogin = async (e) => {
		e.preventDefault();
		const username = e.target.username.value;
		const password = e.target.password.value;
		const loginInfo = { username, password };

		const login = await fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(loginInfo),
		});

		const loginResponse = await login.json();
		console.log(loginResponse);
	};

	return (
		<>
			<h1>Login</h1>
			<form onSubmit={handleLogin}>
				<label>Username</label>
				<input type="text" name="username" id="username" />
				<label>Password</label>
				<input type="password" name="password" id="password" />
				<button type="submit">Login</button>
			</form>
		</>
	);
}
