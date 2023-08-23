import { useSession } from "next-auth/react";
import { getSettlementByID } from "/utils/data/settlements";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";
import { getName } from "/utils/helpers";
import TextWithTitle from "/components/text/title/TextWithTitle";
import styles from "public/styles/pages/Settlement.module.scss";
import Badge from "components/text/badge/Badge";
import { useEffect, useState } from "react";
import { getUsers } from "store/actions/userAction";
import Details from "components/settlement/Details";
import { getSettlementDebts, deleteSettlement } from "utils/data/settlements";
import Overview from "components/settlement/Overview";
import DebtsIncluded from "components/settlement/DebtsIncluded";
import Status from "components/settlement/Status";
import Card from "components/card/Card";
import { formatDate } from "utils/helpers";
import { useRouter } from "next/router";
import Spinner from "components/placeholders/spinner/Spinner";
import Button from "components/button/Button";
import { useSelector } from "react-redux";
import {
	useSettlement,
	useSelectedGroup,
	useUsers,
	useSettlementDebts,
	useGroup,
} from "utils/hooks";

export default function Settlement() {
	const router = useRouter();
	const { data: session, status: sessionStatus } = useSession();
	const users = useUsers();
	const group = useSelectedGroup(session.user.id);
	const settlement = useSettlement(router.query.settlement);
	const debts = useSettlementDebts(router.query.settlement);
	const settlementGroup = useGroup(
		settlement.data ? settlement.data.group : null
	);

	// --------- States --------- \\
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteStatus, setDeleteStatus] = useState(null); // ["success", "error"]

	function handleDeleteSettlement() {
		setDeleteLoading(true);

		deleteSettlement(settlement.data._id).then((data) => {
			console.log(data);
			if (data.success) {
				// Settlement was deleted
				setDeleteStatus("success");
			} else {
				setDeleteStatus("error");
				console.log(data.message);
			}
			setDeleteLoading(false);
		});
	}

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	// --------- Functions --------- \\

	// --------- Variables --------- \\

	let otherParty, otherPartyName, status, stats;

	if (settlement.exists && users.exists) {
		// Get name of other party (not logged in user)
		otherParty =
			settlement.data.settler == session.user.id
				? settlement.data.settlee
				: settlement.data.settler;

		otherPartyName = getName(otherParty, users.data, session);
		status =
			settlement.data.status == "pending"
				? "Pending"
				: settlement.data.status == "closed"
				? "Closed"
				: "Reopened";

		stats = null;
	}

	if (debts.exists) {
		stats = calculateDebtStats(debts.data, session);
	}

	if (settlement.isLoading || debts.isLoading) {
		return <Spinner title="Fetching settlement..." />;
	}

	if (deleteLoading) {
		return <Spinner title="Deleting Settlement..." />;
	}

	if (!settlement.exists || !debts.exists) {
		return (
			<section className={styles.deletedWrapper}>
				<p>{"Error fetching settlement"}</p>
			</section>
		);
	}

	// User is not debtor or creditor
	if (
		settlement.data.settler != session.user.id &&
		settlement.data.settlee != session.user.id
	) {
		return (
			<section className={styles.deletedWrapper}>
				<p>Could not find settlement</p>
			</section>
		);
	}

	// Incorrect group selected
	if (group.exists && settlement.data.group != group.data._id) {
		return (
			<section className={styles.deletedWrapper}>
				<p>Debt not included in selected group ({group.data.name})</p>
			</section>
		);
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
						<p>Failed to delete settlement</p>
						<Button title="Back" onClick={() => router.reload()} />
					</>
				)}
			</section>
		);
	}

	return (
		<section className={styles.flexWrapper}>
			<div className={styles.header}>
				<TextWithTitle
					title={`Settlement with ${otherPartyName}`}
					text={`Identifier: ${settlement.data._id}`}
					className={styles.title}
					align="left"
					large
				/>
				<div className={styles.badges}>
					<Badge
						title={status}
						color={settlement.data.status}
						className={styles.badge}
					/>
					{settlementGroup.exists && (
						<Badge
							title={settlementGroup.data.name}
							color={"group"}
							className={styles.badge}
						/>
					)}
				</div>
			</div>

			<Status
				settlement={settlement.data}
				otherPartyName={otherPartyName}
			/>

			<TextWithTitle
				title="Overview"
				className={styles.title}
				align="left"
			/>
			<Overview stats={stats} otherPartyName={otherPartyName} />

			<TextWithTitle
				title="Details"
				className={styles.title}
				align="left"
			/>
			<Details
				settlement={settlement.data}
				otherPartyName={otherPartyName}
			/>

			<TextWithTitle
				title="Debts Included"
				className={styles.title}
				align="left"
			/>
			<DebtsIncluded debts={debts.data} stats={stats} />

			{/* Delete Settlement */}
			{settlement.data.status != "closed" &&
				settlement.data.creator == session.user.id && (
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
										handleDeleteSettlement();
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
	);
}

function calculateDebtStats(debts, session) {
	let total = 0;
	let debt = 0;
	let unreceived = 0;
	let largestAmount = null;
	let smallestAmount = null;
	let count = 0;

	debts.forEach((currDebt) => {
		// Calculate totals
		length++;

		// Calculate largest and smallest amounts
		if (largestAmount == null) {
			largestAmount = currDebt.amount;
		} else if (currDebt.amount > largestAmount) {
			largestAmount = currDebt.amount;
		}

		if (smallestAmount == null) {
			smallestAmount = currDebt.amount;
		} else if (currDebt.amount < smallestAmount) {
			smallestAmount = currDebt.amount;
		}

		// Calculate who what amount
		if (currDebt.debtor == session.user.id) {
			debt += currDebt.amount;
			total -= currDebt.amount;
		} else {
			unreceived += currDebt.amount;
			total += currDebt.amount;
		}
	});

	return {
		total,
		debt,
		unreceived,
		largestAmount,
		smallestAmount,
		count,
	};
}
