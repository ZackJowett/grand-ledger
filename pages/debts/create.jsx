import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllUsers } from "/utils/data/users";
import Layout from "components/layouts/Layout";
import LoggedOut from "components/sections/login/loggedOut/LoggedOut";
import styles from "public/styles/pages/CreateDebt.module.scss";
import TextWithTitle from "components/text/title/TextWithTitle";
import AddDebt from "components/debt/create/form/AddDebt";
import SubmitDebts from "components/debt/create/form/SubmitDebts";
import DebtList from "components/debt/create/DebtList";
import SingularDebt from "components/debt/create/types/SingularDebt";
import Button from "components/button/Button";
import { set } from "mongoose";

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
		setDebts([new SingleDebt(idCount), ...debts]);
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

				<AddDebt addSingle={addSingle} addMulti={addMulti} />

				<DebtList debts={debts} setDebts={setDebts} />
				<Button
					title="CHECK DEBTS"
					onClick={() => console.log("Debts", debts)}
				/>

				{/* <SubmitDebts /> */}
			</section>

			{/* <h1>Create new debt</h1>

			<p>Create as: </p>
			<select name="creditor" id="creditor" onChange={handleSelect}>
				<option value="creditor">
					Creditor (someone owes you money)
				</option>
				<option value="debtor">Debtor (you owe money)</option>
			</select>

			<form onSubmit={handleRegister}>
				<label htmlFor="otherParty">
					{createAs == "creditor"
						? "Debtor (Who owes you money?)"
						: "Creditor (Who do you owe money to?)"}
				</label>
				<select name="otherParty" id="otherParty" disabled={!users}>
					{users ? (
						users.map((user, index) => {
							if (user._id != session.user.id)
								return (
									<option value={user._id} key={index}>
										{user.name}
									</option>
								);
						})
					) : (
						<option>Loading...</option>
					)}
				</select>

				<label htmlFor="password">amount</label>
				<input
					type="number"
					name="amount"
					id="amount"
					min="0"
					step=".01"
				/>

				<label htmlFor="Description">Description</label>
				<input
					type="textarea"
					name="description"
					id="description"
					required
				/>

				<button type="submit">Confirm New Debt</button>
			</form> */}
		</Layout>
	);
}
