import { useSession } from "next-auth/react";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";

export default function Groups() {
	const { data: session } = useSession();

	// User not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	return (
		<Layout>
			<h1>Groups (Coming Soon)</h1>
		</Layout>
	);
}
