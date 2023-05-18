import { signIn, signOut, useSession } from "next-auth/react";
import { use } from "react";

export default function Private() {
	const { data: session } = useSession();

	if (session) {
		// Logged In

		return (
			<>
				Signed in as {session.user.email}
				<br />
				<button onClick={() => signOut()}>Sign out</button>
			</>
		);
	}

	// Not Logged In
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
}
