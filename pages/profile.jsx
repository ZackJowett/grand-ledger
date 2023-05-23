import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Layout from "../components/layouts/Layout";
import LoggedOut from "../components/sections/login/loggedOut/LoggedOut";

export default function Profile() {
	const { data: session } = useSession();

	return (
		<Layout>
			{session ? (
				<>
					<p>You are logged in</p>
					<p>Name: {session.user.name}</p>
					<p>Email: {session.user.email}</p>
					<p>Username: {session.user.username}</p>
					<button onClick={() => signOut()}>Sign out</button>
				</>
			) : (
				<LoggedOut />
			)}
		</Layout>
	);
}
