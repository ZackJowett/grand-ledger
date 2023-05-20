import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Profile() {
	const { data: session } = useSession();

	return (
		<>
			<h1>Profile</h1>
			<Link href="/">Home</Link>
			{session ? (
				<>
					<p>You are logged in</p>
					<p>Name: {session.user.name}</p>
					<p>Email: {session.user.email}</p>
					<p>Username: {session.user.username}</p>
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
