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
import { getDebtStatus } from "utils/helpers";
import { deleteDebt } from "utils/data/debts";

export default function Debt() {
	const { data: session, status: sessionStatus } = useSession();
	const router = useRouter(); // Dynamically get debt from route

	const state = useStore().getState();
	const [debt, setDebt] = useState(null);
	const [loading, setLoading] = useState(true);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteStatus, setDeleteStatus] = useState(null); // ["success", "error"]

	// Get debt from database
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;

		setLoading(true);

		getOneDebt(router.query.debt).then((data) => {
			if (data) {
				setDebt(data);
			} else {
				console.log("Error fetching debt");
			}
			setLoading(false);
		});
	}, [sessionStatus]);

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	// Wait for debt to load
	// useEffect refreshes component when debt is loaded
	let isDebtor, isClosed, otherParty, otherPartyName, status, creatorName;

	if (debt) {
		// Get if user is debtor or creditor
		isDebtor = debt.debtor == session.user.id;
		isClosed = debt.status == "closed";

		// Get name of other party (not logged in user)
		otherParty = isDebtor ? debt.creditor : debt.debtor;
		otherPartyName = getName(otherParty, state.userList.users, session);
		creatorName = getName(debt.creator, state.userList.users, session);

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

	function handleDeleteDebt() {
		setDeleteLoading(true);

		deleteDebt(debt._id).then((data) => {
			console.log(data);
			if (data.success) {
				// Debt was deleted
				setDeleteStatus("success");
			} else {
				setDeleteStatus("error");
				console.log(data.message);
			}
			setDeleteLoading(false);
		});
	}

	if (loading) {
		return (
			<Layout>
				<Spinner title="Fetching debt..." />
			</Layout>
		);
	}

	if (deleteLoading) {
		return (
			<Layout>
				<Spinner title="Deleting Debt..." />
			</Layout>
		);
	}

	if (deleteStatus !== null) {
		return (
			<Layout>
				<section className={styles.deletedWrapper}>
					{deleteStatus === "success" ? (
						<>
							<p>{"Successfully deleted"}</p>
							<Button
								title="Back"
								onClick={() => router.back()}
							/>
						</>
					) : (
						<>
							<p>Failed to delete debt</p>
							<Button
								title="Back"
								onClick={() => router.reload()}
							/>
						</>
					)}
				</section>
			</Layout>
		);
	}

	return (
		<Layout includeBack>
			{debt ? (
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
							title={getDebtStatus(debt.status, !isDebtor)}
							color={debt.status}
							className={styles.badge}
						/>
					</div>

					{debt.status == "closed" ||
						(debt.status == "pending" && (
							<Button
								title="View Settlement Details"
								href={`/settlements/${debt.settlement}`}
							/>
						))}

					{debt.status == "outstanding" && (
						<Button
							title={`Settle debts with ${otherPartyName}`}
							href="/settlements/create"
							className={styles.settleButton}
						/>
					)}

					<TextWithTitle
						title="Amount"
						align="left"
						reverse
						className={styles.title}
					/>
					<Card dark>
						<TextWithTitle
							title={getAmountDescriptor()}
							text={
								<Money
									amount={
										isDebtor ? -debt.amount : debt.amount
									}
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

					<TextWithTitle
						title="Details"
						align="left"
						reverse
						className={styles.title}
					/>
					<Card dark>
						<div className={styles.details}>
							<TextWithTitle
								text="Description"
								title={debt.description}
								align="left"
								reverse
								tiny
							/>
							<hr className={styles.hrLong} />
							<TextWithTitle
								text={`Opened by ${creatorName}`}
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

					{debt.status == "outstanding" &&
						debt.creator == session.user.id && (
							<div className={styles.deleteWrapper}>
								{confirmDelete ? (
									<>
										<Button
											title="Cancel"
											className={styles.cancel}
											onClick={() => {
												setConfirmDelete(false);
											}}
										/>
										<Button
											title="Confirm Deletion"
											className={styles.delete}
											onClick={() => {
												handleDeleteDebt();
											}}
										/>
									</>
								) : (
									<Button
										title="Delete"
										className={styles.delete}
										onClick={() => setConfirmDelete(true)}
									/>
								)}
							</div>
						)}
				</section>
			) : (
				<p>Could not find debt.</p>
			)}
		</Layout>
	);
}
