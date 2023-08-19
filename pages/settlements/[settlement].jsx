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

export default function Settlement() {
	const { data: session, status: sessionStatus } = useSession();
	const userState = useSelector((state) => state.users);
	const users = userState.list;
	const router = useRouter();

	// --------- States --------- \\
	const [settlement, setSettlement] = useState();
	const [debts, setDebts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteStatus, setDeleteStatus] = useState(null); // ["success", "error"]

	// Get debt from database
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;
		setLoading(true);
		getSettlementByID(router.query.settlement).then((data) => {
			if (data) {
				setSettlement(data);
			}
			setLoading(false);
		});
	}, [sessionStatus]);

	// --------- Effects --------- \\

	useEffect(() => {
		if (!settlement) return;
		getSettlementDebts(settlement._id).then((res) => setDebts(res));
	}, [settlement]);

	function handleDeleteSettlement() {
		setDeleteLoading(true);

		deleteSettlement(settlement._id).then((data) => {
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

	if (!userState.ready) {
		return <Spinner title="Loading..." />;
	}

	// --------- Functions --------- \\

	// --------- Variables --------- \\

	let otherParty, otherPartyName, status, stats;

	if (settlement) {
		// Get name of other party (not logged in user)
		otherParty =
			settlement.settler == session.user.id
				? settlement.settlee
				: settlement.settler;

		otherPartyName = getName(otherParty, users, session);
		status =
			settlement.status == "pending"
				? "Pending"
				: settlement.status == "closed"
				? "Closed"
				: "Reopened";

		stats = null;
	}

	if (debts) {
		stats = calculateDebtStats(debts, session);
	}

	if (loading) {
		return <Spinner title="Fetching settlement..." />;
	}

	if (deleteLoading) {
		return <Spinner title="Deleting Settlement..." />;
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
					text={`Identifier: ${settlement._id}`}
					className={styles.title}
					align="left"
					large
				/>
				<Badge
					title={status}
					color={settlement.status}
					className={styles.badge}
				/>
			</div>

			<Status settlement={settlement} otherPartyName={otherPartyName} />

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
			<Details settlement={settlement} otherPartyName={otherPartyName} />

			<TextWithTitle
				title="Debts Included"
				className={styles.title}
				align="left"
			/>
			<DebtsIncluded debts={debts} stats={stats} />

			{/* Delete Settlement */}
			{settlement.status != "closed" &&
				settlement.creator == session.user.id && (
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
