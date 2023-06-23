import { useSession } from "next-auth/react";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";

export default function Settings() {
	const { data: session, status: sessionStatus } = useSession();

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	return (
		<Layout>
			<h1>Settings (Coming Soon)</h1>
		</Layout>
	);
}
