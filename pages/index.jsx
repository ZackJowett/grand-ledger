import { useSession } from "next-auth/react";
import Main from "../components/sections/main/Main";
import Layout from "../components/layouts/Layout";

export default function Home() {
	return (
		<Layout>
			<Main />
		</Layout>
	);
}
