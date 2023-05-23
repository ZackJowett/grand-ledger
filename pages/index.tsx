import { useSession } from "next-auth/react";
import "/";
import Main from "../components/sections/Main/Main";
import Layout from "../components/layouts/Layout";

export default function Home() {
	// Login Session
	const { data: session } = useSession();

	return (
		<Layout>
			<Main />
		</Layout>
	);
}
