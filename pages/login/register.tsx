import bcrypt from "bcrypt";

export default function Register() {
	const saltRounds = 10;

	const handleRegister = async (e) => {
		e.preventDefault();
		const username = e.target.username.value;
		const password = e.target.password.value;
		const name = e.target.name.value;
		const email = e.target.email.value;
		// Encrypt password

		// bcrypt.hash(password, saltRounds, (err, hash) => {});
		// 	if (err) {
		// 		console.log(err);
		// 		return;
		// 	}
		// 	console.log(hash);
		// });
		const res = await fetch("/api/users/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password, name, email }),
		});
		const data = await res.json();
		console.log(data);
	};

	return (
		<>
			<h1>Register</h1>
			<form onSubmit={handleRegister}>
				<label htmlFor="username">Username</label>
				<input type="text" name="username" id="username" />
				<label htmlFor="password">Password</label>
				<input type="password" name="password" id="password" />
				<label htmlFor="name">Name</label>
				<input type="text" name="name" id="name" />
				<label htmlFor="email">Email</label>
				<input type="email" name="email" id="email" />
				<button type="submit">Register</button>
			</form>
		</>
	);
}
