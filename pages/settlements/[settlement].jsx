import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDate } from "/utils/helpers";
import { getAllSettlements, getSettlementByID } from "/utils/data/settlements";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";

// Get all debts associated with logged in user and export as path options
// for next.js router
export async function getStaticPaths() {
	try {
		const settlements = await getAllSettlements();
		return {
			paths: settlements.map((settlement) => ({
				params: { settlement: settlement._id },
			})),
			fallback: false,
		};
	} catch (error) {
		console.log(error);
		return { paths: [], fallback: false };
	}
}

export async function getStaticProps({ params }) {
	const settlement = await getSettlementByID(params.settlement);

	return {
		props: { settlement: settlement[0] },
	};
}

export default function Settlement({ settlement }) {
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
			<h1>Settlement</h1>
			<hr />
			<div>
				<p>Settlement Number: {settlement.number}</p>
				<p>Settler: {settlement.settler}</p>
				<p>Settlee: {settlement.settlee}</p>
				<p>Amount: ${settlement.netAmount}</p>
				<p>Description: {settlement.description}</p>

				<p>
					Status:{" "}
					{settlement.status == "pending"
						? `Pending (Waiting on ${settlement.settlee})`
						: settlement.status == "open"
						? "Open"
						: settlement.status == "closed"
						? "Closed"
						: ""}
				</p>

				<p>Date Created: {formatDate(settlement.dateCreated)}</p>
			</div>
		</Layout>
	);
}
