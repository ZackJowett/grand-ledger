import { useSession } from "next-auth/react";
import Main from "../components/sections/main/Main";
import Layout from "../components/layouts/Layout";
import LoggedOut from "../components/sections/login/loggedOut/LoggedOut";

export default function Home() {
	const { data: session, status: sessionStatus } = useSession();

	// User not logged in
	if (sessionStatus !== "authenticated") {
		console.log(sessionStatus);
		return <LoggedOut />;
	}
	return <Main />;
}
