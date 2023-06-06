import { useSession } from "next-auth/react";
import { getAllSettlements, getSettlementByID } from "/utils/data/settlements";
import Layout from "../../components/layouts/Layout";
import LoggedOut from "../../components/sections/login/loggedOut/LoggedOut";
import { getName } from "/utils/helpers";
import { useStore, useDispatch, useSelector } from "react-redux";
import TextWithTitle from "/components/text/title/TextWithTitle";
import styles from "public/styles/pages/Settlement.module.scss";
import Badge from "components/text/badge/Badge";
import { useEffect, useState } from "react";
import { getUsers } from "store/actions/userAction";
import Details from "components/settlement/Details";
import { getSettlementDebts } from "utils/data/settlements";
import Overview from "components/settlement/Overview";
import DebtsIncluded from "components/settlement/DebtsIncluded";
import Status from "components/settlement/Status";
import Card from "components/card/Card";
import { formatDate } from "utils/helpers";
import { useRouter } from "next/router";
import Spinner from "components/placeholders/spinner/Spinner";

export default function Settlement() {
	const { data: session } = useSession();
	const router = useRouter();

	// --------- States --------- \\
	const [settlement, setSettlement] = useState();
	const [debts, setDebts] = useState([]);

	// Get debt from database
	useEffect(() => {
		if (!session) return;
		getSettlementByID(router.query.settlement).then((data) => {
			data
				? setSettlement(data)
				: console.log("Error fetching settlement");
		});
	}, [session]);

	// Get Redux State
	const dispatch = useDispatch();
	useSelector((state) => state.userList.users);
	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);
	const state = useStore().getState();

	// --------- Effects --------- \\

	useEffect(() => {
		if (!settlement) return;
		getSettlementDebts(settlement._id).then((res) => setDebts(res));
	}, [settlement]);

	// Not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
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

		otherPartyName = getName(otherParty, state.userList.users, session);
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

	// Wait for settlement to be fetched
	if (!settlement) {
		return (
			<Layout>
				<Spinner title="Fetching settlement..." />
			</Layout>
		);
	}

	return (
		<Layout>
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

				<Status
					settlement={settlement}
					otherPartyName={otherPartyName}
				/>

				<Overview stats={stats} otherPartyName={otherPartyName} />

				<Details
					settlement={settlement}
					otherPartyName={otherPartyName}
				/>

				<DebtsIncluded debts={debts} stats={stats} />

				<Card title="Timeline" dark>
					<div className={styles.dates}>
						<TextWithTitle
							text="Opened"
							title={formatDate(settlement.dateCreated)}
							align="left"
							reverse
							tiny
						/>

						{settlement.dateReopened && (
							<TextWithTitle
								text="Rejected"
								title={formatDate(settlement.dateReopened)}
								align="left"
								reverse
								tiny
							/>
						)}

						{settlement.dateClosed && (
							<TextWithTitle
								text="Closed"
								title={formatDate(settlement.dateClosed)}
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
