import Link from "next/link";
import { useSession } from "next-auth/react";
import { getAllDebts, getOneDebt } from "/utils/data/debts";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";

// Get all debts associated with logged in user and export as path options
// for next.js router
export async function getStaticPaths() {
	try {
		const debts = await getAllDebts();
		return {
			paths: debts.map((debt) => ({
				params: { debt: debt._id },
			})),
			fallback: false,
		};
	} catch (error) {
		console.log(error);
		return { paths: [], fallback: false };
	}
}

export async function getStaticProps({ params }) {
	const debt = await getOneDebt(params.debt);

	return {
		props: { debt: debt[0] },
	};
}

export default function Debt({ debt }) {
	const { data: session } = useSession();

	// Not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	return (
		<Layout>
			<h1>Debt</h1>
			<Link href="/">Home</Link>
			<hr />
			<div>
				<p>Creditor {debt.creditor}</p>
				<p>Debtor: {debt.debtor}</p>
				<p>Amount: ${debt.amount}</p>
				<p>Description: {debt.description}</p>
				<p>Status: {debt.closed ? "Closed" : "Open"}</p>
				<p>ID: {debt._id}</p>
			</div>
		</Layout>
	);
}
