import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllUsers } from "/utils/data/users";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import styles from "public/styles/pages/CreateDebt.module.scss";
import TextWithTitle from "components/text/title/TextWithTitle";
import AddDebt from "components/debt/create/form/AddDebt";
import SubmitDebts from "components/debt/create/form/SubmitDebts";
import DebtList from "components/debt/create/DebtList";
import Spinner from "components/placeholders/spinner/Spinner";
import TextButton from "components/button/text/TextButton";

// Classes
function SingleDebt(
	id,
	createAs = "creditor",
	otherParty = "",
	amount = 0,
	description = ""
) {
	this.id = id;
	this.type = "single";
	this.createAs = createAs;
	this.otherParty = otherParty;
	this.amount = amount;
	this.description = description;
}

function MultiDebt(id, total = 0, parties = [], description = "") {
	this.id = id;
	this.type = "multi";
	this.total = total;
	this.parties = parties;
	this.description = description;
}

export default function Create() {
	const { data: session, status: sessionStatus } = useSession();

	// States
	const [createAs, setCreateAs] = useState("creditor");
	const [users, setUsers] = useState(null);
	const [debts, setDebts] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(null);
	var [idCount, setIdCount] = useState(0);
	const [numDebts, setNumDebts] = useState({ total: 0, single: 0, multi: 0 });

	// User logged in
	// Get user options in same group
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;

		getAllUsers().then((data) => {
			data ? setUsers(data) : console.log("Error fetching data");
		});
	}, [sessionStatus]);

	// Update number of debts counter
	useEffect(() => {
		console.log(debts);
		// Update numDebts
		let numSingle = 0;
		let numMulti = 0;
		debts.forEach((debt) => {
			if (debt.type === "single") numSingle++;
			else numMulti++;
		});

		setNumDebts({
			total: debts.length,
			single: numSingle,
			multi: numMulti,
		});
	}, [debts]);

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	// ----------- Add debt to list ---------------- \\
	// Single debt
	function addSingle() {
		// Get default other party that is not the user
		let otherParty =
			users[0]._id == session.user.id ? users[1]._id : users[0]._id;

		let newDebt = new SingleDebt(idCount);
		newDebt.otherParty = otherParty;

		setDebts([newDebt, ...debts]);
		setIdCount(idCount + 1);
	}

	// Multi Debt
	function addMulti() {
		setDebts([new MultiDebt(idCount), ...debts]);
		setIdCount(idCount + 1);
	}

	return (
		<Layout>
			<section className={styles.wrapper}>
				<TextWithTitle
					title={`New Debt`}
					text="Open one or multiple debts with one or multiple people"
					className={styles.header}
					align="left"
					large
				/>

				{submitting ? (
					<Spinner title="Creating debts..." />
				) : (
					<>
						{submitError && (
							<p className={styles.error}>
								There was an error creating the debts. Please
								try again or contact admin.
							</p>
						)}
						{submitSuccess && (
							<p className={styles.success}>
								Successfully created debts.
								<br />
								<TextButton
									title="View Debts"
									link="/debts"
									className={styles.link}
								/>{" "}
								<br />
								<TextButton
									title="View payments owed to you"
									link="/unreceived-payments"
									className={styles.link}
								/>{" "}
							</p>
						)}
						<AddDebt
							numDebts={numDebts}
							addSingle={addSingle}
							addMulti={addMulti}
						/>

						<DebtList debts={debts} setDebts={setDebts} />

						{numDebts.total > 0 ? (
							<>
								<hr className={styles.hr} />
								<SubmitDebts
									debts={debts}
									setDebts={setDebts}
									setSubmitting={setSubmitting}
									setSubmitError={setSubmitError}
									setSubmitSuccess={setSubmitSuccess}
								/>
							</>
						) : (
							<p className={styles.startHint}>
								Choose an option above to start
							</p>
						)}
					</>
				)}
			</section>
		</Layout>
	);
}
