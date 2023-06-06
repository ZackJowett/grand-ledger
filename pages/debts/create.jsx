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
	const { data: session } = useSession();

	// States
	const [createAs, setCreateAs] = useState("creditor");
	const [users, setUsers] = useState(null);
	const [debts, setDebts] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(null);
	var [idCount, setIdCount] = useState(0);

	// User logged in
	// Get user options in same group
	useEffect(() => {
		if (!session) return;

		getAllUsers().then((data) => {
			data ? setUsers(data) : console.log("Error fetching data");
		});
	}, [session]);

	useEffect(() => {
		console.log(debts);
	}, [debts]);

	// User not logged in
	if (!session) {
		return (
			<Layout>
				<LoggedOut />
			</Layout>
		);
	}

	// ----------- Handle submission ---------------- \\
	const handleRegister = async (e) => {
		e.preventDefault();

		let creditor = session.user.id;
		let debtor = e.target.otherParty.value;

		if (createAs == "debtor") {
			creditor = e.target.otherParty.value;
			debtor = session.user.id;
			console.log("created as debtor");
		}

		const amount = e.target.amount.value;
		const description = e.target.description.value;

		const res = await fetch("/api/debts/newDebt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				creditor,
				debtor,
				amount,
				description,
				userId: session.user.id,
			}),
		});

		const data = await res.json();
		console.log(data);
	};

	const handleSelect = (e) => {
		setCreateAs(e.target.value);
	};

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
							numDebts={debts.length}
							addSingle={addSingle}
							addMulti={addMulti}
						/>

						<DebtList debts={debts} setDebts={setDebts} />

						{debts.length > 0 && (
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
						)}
					</>
				)}
			</section>
		</Layout>
	);
}
