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

	// --------- States --------- \\
	const [debts, setDebts] = useState([]);

	// Get Redux State
	const dispatch = useDispatch();
	useSelector((state) => state.userList.users);
	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);
	const state = useStore().getState();

	// --------- Effects --------- \\

	useEffect(() => {
		getSettlementDebts(settlement._id).then((res) => setDebts(res));
	}, []);

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

	// Get name of other party (not logged in user)
	const otherParty =
		settlement.settler == session.user.id
			? settlement.settlee
			: settlement.settler;

	const otherPartyName = getName(otherParty, state.userList.users, session);
	const status =
		settlement.status == "pending"
			? "Pending"
			: settlement.status == "closed"
			? "Closed"
			: "Open";

	let stats = null;

	if (debts) {
		stats = calculateDebtStats(debts, session);
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

				<hr className={styles.hr} />

				<Overview stats={stats} otherPartyName={otherPartyName} />

				<Details
					settlement={settlement}
					otherPartyName={otherPartyName}
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
