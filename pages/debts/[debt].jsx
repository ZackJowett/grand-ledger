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
import Money from "components/text/money/Money";
import Button from "components/button/Button";
import { formatDate } from "utils/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "components/placeholders/spinner/Spinner";
import { getDebtStatus } from "utils/helpers";
import { deleteDebt } from "utils/data/debts";
import { useSelector } from "react-redux";
import { useGroup, useDebt, useSelectedGroup, useUsers } from "utils/hooks";

export default function Debt() {
	const router = useRouter(); // Dynamically get debt from route
	const { data: session, status: sessionStatus } = useSession();
	const selectedGroup = useSelectedGroup(session.user.id);
	const users = useUsers();
	const debt = useDebt(router.query.debt ? router.query.debt : null);
	const group = useGroup(debt.exists ? debt.data.group : null);

	// States
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteStatus, setDeleteStatus] = useState(null); // ["success", "error"]

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	// Wait for debt to load
	// useEffect refreshes component when debt is loaded
	let isDebtor, isClosed, otherParty, otherPartyName, status, creatorName;

	if (debt.exists && users.exists) {
		// Get if user is debtor or creditor
		isDebtor = debt.data.debtor == session.user.id;
		isClosed = debt.data.status == "closed";

		// Get name of other party (not logged in user)
		otherParty = isDebtor ? debt.data.creditor : debt.data.debtor;
		otherPartyName = getName(otherParty, users.data, session);
		creatorName = getName(debt.data.creator, users.data, session);

		// Get status of debt
		status =
			debt.data.status == "pending"
				? "Pending"
				: debt.data.status == "closed"
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

		deleteDebt(debt.data._id).then((data) => {
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

	if (
		debt.isLoading ||
		group.isLoading ||
		selectedGroup.isLoading ||
		users.isLoading
	) {
		return <Spinner title="Loading..." />;
	}

	if (
		debt.isError ||
		group.isError ||
		selectedGroup.isError ||
		users.isError ||
		!debt.exists
	) {
		return <p>Failed to load debt</p>;
	}

	// User is not debtor or creditor
	if (
		debt.data.creditor != session.user.id &&
		debt.data.debtor != session.user.id
	) {
		return <p>Could not find debt</p>;
	}

	// Incorrect group selected
	if (selectedGroup.data && debt.data.group != selectedGroup.data._id) {
		return (
			<p>
				Debt not included in selected group ({selectedGroup.data.name})
			</p>
		);
	}

	if (deleteLoading) {
		return <Spinner title="Deleting Debt..." />;
	}

	if (deleteStatus !== null) {
		return (
			<section className={styles.deletedWrapper}>
				{deleteStatus === "success" ? (
					<>
						<p>{"Successfully deleted"}</p>
						<Button title="Back" onClick={() => router.back()} />
					</>
				) : (
					<>
						<p>Failed to delete debt</p>
						<Button title="Back" onClick={() => router.reload()} />
					</>
				)}
			</section>
		);
	}

	return (
		<>
			{debt.exists ? (
				<section className={styles.wrapper}>
					<div className={styles.header}>
						<TextWithTitle
							title={getDebtTitle()}
							text={`Identifier: ${
								debt.data.id ? debt.data.id : debt._id
							}`}
							className={styles.title}
							align="left"
							large
						/>
						<div className={styles.badges}>
							<Badge
								title={getDebtStatus(
									debt.data.status,
									!isDebtor
								)}
								color={debt.data.status}
								className={styles.badge}
							/>
							{group.exists && (
								<Badge
									title={group.data.name}
									color={"group"}
									className={styles.badge}
								/>
							)}
						</div>
					</div>

					{debt.data.status == "closed" ||
						(debt.data.status == "pending" && (
							<Button
								title="View Settlement Details"
								href={`/settlements/${debt.data.settlement}`}
							/>
						))}

					{debt.data.status == "outstanding" && (
						<Button
							title={`Settle debts with ${otherPartyName}`}
							href={`/settlements/create?id=${otherParty}`}
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
										isDebtor
											? -debt.data.amount
											: debt.data.amount
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
								title={debt.data.description}
								align="left"
								reverse
								tiny
							/>
							<hr className={styles.hrLong} />
							<TextWithTitle
								text={`Opened by ${creatorName}`}
								title={formatDate(debt.data.dateCreated)}
								align="left"
								reverse
								tiny
							/>

							{debt.data.dateClosed && (
								<TextWithTitle
									text="Closed"
									title={formatDate(debt.data.dateClosed)}
									align="left"
									reverse
									tiny
								/>
							)}
						</div>
					</Card>

					{debt.data.status == "outstanding" &&
						debt.data.creator == session.user.id && (
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
		</>
	);
}
