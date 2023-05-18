import { signIn, signOut, useSession } from "next-auth/react";

export default function Profile() {
	const { data: session } = useSession();

	return (
		<>
			<h1>Profile</h1>
			{session ? (
				<>
					<p>You are logged in</p>
					<p>Name: {session.user.name}</p>
					<p>Email: {session.user.email}</p>
					<button onClick={() => signOut()}>Sign out</button>
				</>
			) : (
				<>
					<p>You are not logged in</p>
					<button onClick={() => signIn()}>Sign in</button>
				</>
			)}
		</>
	);
}
