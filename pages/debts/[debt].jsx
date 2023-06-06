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
import Button from "components/button/Button";
import { formatDate } from "utils/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "components/placeholders/spinner/Spinner";

export default function Debt() {
	const { data: session } = useSession();
	const state = useStore().getState();
	const [debt, setDebt] = useState(null);
	const router = useRouter(); // Dynamically get debt from route

	// Get debt from database
	useEffect(() => {
		if (!session) return;
		getOneDebt(router.query.debt).then((data) => {
			data ? setDebt(data) : console.log("Error fetching debt");
		});
	}, [session]);

	// Not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	// Wait for debt to load
	// useEffect refreshes component when debt is loaded
	let isDebtor, isClosed, otherParty, otherPartyName, status;

	if (debt) {
		// Get if user is desbtor or creditor
		isDebtor = debt.debtor == session.user.id;
		isClosed = debt.status == "closed";

		// Get name of other party (not logged in user)
		otherParty = isDebtor ? debt.creditor : debt.debtor;
		otherPartyName = getName(otherParty, state.userList.users, session);

		// Get status of debt
		status =
			debt.status == "pending"
				? "Pending"
				: debt.status == "closed"
				? "Closed"
				: "Outstanding";
	}

	// Helper functions
	function getAmountDescriptor() {
		if (isDebtor) {
			if (isClosed) return `You paid ${otherPartyName}`; // Closed as debtor
			return `You owe ${otherPartyName}`; // Open/Pending as debtor
		} else {
			if (isClosed) return `${otherPartyName} paid you`; // Closed as creditor
			return `${otherPartyName} owes you`; // Open/Pending as creditor
		}
	}

	function getDebtTitle() {
		if (isDebtor) {
			return `Debt with ${otherPartyName}`;
		} else {
			if (isClosed) return `Received Payment from ${otherPartyName}`;
			return `Unreceived Payment from ${otherPartyName}`; //
		}
	}

	if (!debt) {
		return (
			<Layout>
				<Spinner title="Fetching debt..." />
			</Layout>
		);
	}

	return (
		<Layout>
			<section className={styles.wrapper}>
				<div className={styles.header}>
					<TextWithTitle
						title={getDebtTitle()}
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

				{debt.status == "closed" || debt.status == "pending" ? (
					<Button
						title="View Settlement Details"
						href={`/settlements/${debt.settlement}`}
					/>
				) : null}

				<Card title="Amount" dark>
					<TextWithTitle
						title={getAmountDescriptor()}
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
				</Card>

				{debt.status == "outstanding" && (
					<Button
						title={`Settle debts with ${otherPartyName}`}
						href="/settlements/create"
						className={styles.settleButton}
					/>
				)}

				<Card dark>
					<div className={styles.details}>
						<TextWithTitle
							text="Description"
							title={debt.description}
							align="left"
							reverse
							tiny
						/>
					</div>
				</Card>
				<Card title="Timeline" dark>
					<div className={styles.dates}>
						<TextWithTitle
							text="Opened"
							title={formatDate(debt.dateCreated)}
							align="left"
							reverse
							tiny
						/>

						{debt.dateClosed && (
							<TextWithTitle
								text="Closed"
								title={formatDate(debt.dateClosed)}
								align="left"
								reverse
								tiny
							/>
						)}
					</div>
				</Card>
			</section>
		</Layout>
	);
}
