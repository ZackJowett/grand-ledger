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
	const { data: session, status: sessionStatus } = useSession();
	const router = useRouter();

	// --------- States --------- \\
	const [settlement, setSettlement] = useState();
	const [debts, setDebts] = useState([]);

	// Get debt from database
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;
		getSettlementByID(router.query.settlement).then((data) => {
			data
				? setSettlement(data)
				: console.log("Error fetching settlement");
		});
	}, [sessionStatus]);

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

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
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
		<Layout includeBack>
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
					settlement={settlement}
					otherPartyName={otherPartyName}
				/>

				<TextWithTitle
					title="Debts Included"
					className={styles.title}
					align="left"
				/>
				<DebtsIncluded debts={debts} stats={stats} />
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
