import Link from "next/link";
import { useSession } from "next-auth/react";
import { getAllDebts, getOneDebt } from "/utils/data/debts";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import Card from "components/card/Card";
import styles from "public/styles/pages/Debt.module.scss";
import TextWithTitle from "components/text/title/TextWithTitle";
import { getName } from "utils/helpers";
import Badge from "components/text/badge/Badge";
import { useStore } from "react-redux";
import Money from "components/text/money/Money";

// Get all debts associated with logged in user and export as path options
// for next.js router
export async function getStaticPaths() {
	try {
		const debts = await getAllDebts();

		if (!debts) return { paths: [], fallback: false };

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
	if (!params.debt) return { props: { debt: null } };
	const debt = await getOneDebt(params.debt);

	return {
		props: { debt: debt[0] },
	};
}

export default function Debt({ debt }) {
	const { data: session } = useSession();
	const state = useStore().getState();

	// Not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	// Get name of other party (not logged in user)
	const otherParty =
		debt.debtor == session.user.id ? debt.creditor : debt.debtor;
	const otherPartyName = getName(otherParty, state.userList.users, session);

	// Get status of debt
	const status =
		debt.status == "pending"
			? "Pending"
			: debt.status == "closed"
			? "Closed"
			: "Outstanding";

	if (!debt) return null;
	return (
		<Layout>
			<section className={styles.wrapper}>
				<div className={styles.header}>
					<TextWithTitle
						title={`Debt with ${otherPartyName}`}
						text={`Identifier: ${debt._id}`}
						className={styles.title}
						align="left"
						large
					/>
					<Badge
						title={status}
						color={debt.status}
						className={styles.badge}
					/>
				</div>

				<Card title="Amount" dark>
					<TextWithTitle
						title={`Total owed to ${otherPartyName}`}
						text={
							<Money
								amount={debt.amount}
								className={styles.debt}
								background
								small
							/>
						}
						className={styles.textWithTitle}
						align="left"
						tiny
					/>

					<div>
						<p>Creditor {debt.creditor}</p>
						<p>Debtor: {debt.debtor}</p>
						<p>Amount: ${debt.amount}</p>
						<p>Description: {debt.description}</p>
						<p>Status: {debt.closed ? "Closed" : "Open"}</p>
						<p>ID: {debt._id}</p>
					</div>
				</Card>
				<hr />
			</section>
		</Layout>
	);
}
