import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Settlements() {
	// Session
	const { data: session } = useSession();

	// User logged in
	// States
	const [settlements, setSettlements] = useState(null);
	const [users, setUsers] = useState(null);

	// Get settlements
	useEffect(() => {
		if (!session) return;

		fetch(`/api/settlements/getAll?userId=${session.user.id}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setSettlements(data.data);
				} else {
					console.log(data.message);
					alert(
						"Error fetching settlements. Check console for details or contact admin."
					);
				}
			});

		// Get user information regarding settlements
		fetch(`/api/users`)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setUsers(data.data);
				} else {
					console.log(data.message);
					alert(
						"Error fetching users. Check console for details or contact admin."
					);
				}
			});
	}, [session]);

	// User not logged in
	if (!session) {
		return (
			<>
				<h1>Settlements</h1>
				<p>You are not logged in</p>
				<button onClick={() => signIn()}>Sign in</button>
			</>
		);
	}

	const getUserName = (id) => {
		if (!users) return;
		const user = users.find((user) => user._id == id);
		if (!user) return;
		return user.name;
	};

	return (
		<div>
			<h1>Settlements</h1>
			<p>Settlements are closures of multiple debts to the same person</p>
			<p>
				Whoever owes the most to the other person will be the settler in
				the settlement and must pay the net and close it
			</p>
			<p>
				It is then pending and won&apos;t appear in any calculations.
				The other person then must approve/deny the settlement for it to
				be fully closed or open again
			</p>
			<Link href="/settlements/create">Create Settlement</Link>
			<br />
			{settlements
				? settlements.map((settlement, index) => {
						if (settlement.settler == session.user.id) {
							// Settler is logged in user
							const settleeName = getUserName(settlement.settlee);

							return (
								<>
									<div key={index}>
										<p>
											Settlement Number:{" "}
											{settlement.number}
										</p>
										<p>Settler: You</p>
										<p>Settlee: {settleeName}</p>
										<p>Amount: ${settlement.netAmount}</p>

										<p>
											Status:{" "}
											{settlement.status == "pending"
												? `Pending (Waiting on ${settleeName})`
												: settlement.status == "open"
												? "Open"
												: settlement.status == "closed"
												? "Closed"
												: ""}
										</p>
										<p>
											Date Created:{" "}
											{formatDate(settlement.dateCreated)}
										</p>
									</div>
								</>
							);
						}

						// Settlee is logged in user
						const settlerName = getUserName(settlement.settler);
						return (
							<>
								<div key={index}>
									<p>
										Settlement Number: {settlement.number}
									</p>
									<p>Settler: {settlerName}</p>
									<p>Settlee: You</p>
									<p>Amount: ${settlement.netAmount}</p>

									<p>
										Status:{" "}
										{settlement.status == "pending"
											? `Pending (Waiting on ${settlerName})`
											: settlement.status == "open"
											? "Open"
											: settlement.status == "closed"
											? "Closed"
											: ""}
									</p>
									<p>
										Date Created:{" "}
										{formatDate(settlement.dateCreated)}
									</p>
								</div>
							</>
						);
				  })
				: "Loading settlements..."}
		</div>
	);
}

function formatDate(date) {
	const dateObject = new Date(date);
	const formattedDate = new Intl.DateTimeFormat("en-GB", {
		dateStyle: "full",
		timeStyle: "short",
		timeZone: "Australia/Sydney",
		hourCycle: "h12",
	}).format(dateObject);
	return formattedDate;
}
