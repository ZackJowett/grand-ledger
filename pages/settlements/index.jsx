import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllSettlements } from "/utils/data/settlements";
import Settlement from "/components/settlement/Settlement";
import Button from "/components/button/Button";
import styles from "public/styles/pages/Settlements.module.scss";
import Layout from "/components/layouts/Layout";
import LoggedOut from "/components/sections/login/loggedOut/LoggedOut";
import Card from "/components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import { filterSettlements } from "/utils/helpers";
import { CardPlaceholder } from "components/placeholders/Placeholders";
import Select from "components/forms/Select";
import { FiPlusSquare } from "react-icons/fi";
import { TiArrowForward } from "react-icons/ti";
import { useSelector } from "react-redux";
import { useSelectedGroup, useSettlementsWithUser } from "utils/hooks";

export default function Settlements() {
	// Session
	const { data: session, status: sessionStatus } = useSession();
	const userState = useSelector((state) => state.users);
	const users = userState.list;
	const selectedGroup = useSelectedGroup(session.user.id);

	// User logged in
	// States
	const {
		data: settlements,
		isLoading: settlementsLoading,
		isError: settlementsError,
	} = useSettlementsWithUser(
		session.user.id,
		selectedGroup.data ? selectedGroup.data._id : null
	);
	const [filter, setFilter] = useState("all"); // "all" || "open" || "closed"
	const [userFilter, setUserFilter] = useState(null);

	// User not logged in
	if (sessionStatus !== "authenticated") {
		return <LoggedOut />;
	}

	const handleFilterSelect = (option) => {
		setFilter(option.value);
	};
	const handleUserFilterSelect = (option) => {
		setUserFilter(option.value);
	};

	const options = [
		{ value: "all", label: "All" },
		{ value: "reopened", label: "Reopened" },
		{ value: "pending", label: "Pending" },
		{ value: "closed", label: "Closed" },
	];
	let userOptions = [];

	if (userState.ready) {
		userOptions = [
			{ value: null, label: "Everyone" },
			...users
				.map((user) => {
					// Don't include logged in user in filter
					if (user._id == session.user.id) return;
					return {
						value: user._id,
						label: user.name,
					};
				})
				.filter((item) => item), // removes	undefined items
		];
	}

	return (
		<section className={styles.wrapper}>
			<div className={styles.heading}>
				<TextWithTitle
					title="Settlements"
					text="An offer to close multiple debts to the same person"
					align="left"
				/>
			</div>
			<div className={styles.buttons}>
				<Button
					title="New Settlement"
					icon={<TiArrowForward />}
					href="/settlements/create"
					className={styles.create}
				/>
				<Button
					title="New Debt"
					icon={<FiPlusSquare />}
					href="/debts/create"
					className={styles.create}
					secondary
				/>
			</div>
			<Card dark title="Settlements">
				<hr className={styles.hr} />
				<div className={styles.filters}>
					<Select
						options={options}
						defaultValue={options[0]}
						className={styles.select}
						onChange={handleFilterSelect}
					/>
					<Select
						options={userOptions}
						defaultValue={userOptions[0]}
						className={styles.select}
						onChange={handleUserFilterSelect}
					/>
				</div>
				<div className={styles.cards}>
					{settlementsLoading || selectedGroup.isLoading ? (
						// Loading
						<>
							<CardPlaceholder />
							<CardPlaceholder />
							<CardPlaceholder />
						</>
					) : settlementsError || selectedGroup.isError ? (
						// Erorr occurred
						<p>Erorr loading settlements</p>
					) : settlements && settlements.length <= 0 ? (
						// No settlements
						<p className={styles.noSettlements}>
							{`You have no ${
								filter != "all" ? filter : ""
							} settlements`}
						</p>
					) : (
						// Map Settlements
						settlements.map((settlement, index) => {
							if (
								!filterSettlements(
									settlement,
									filter,
									userFilter
								)
							)
								return;

							return (
								<Settlement
									key={index}
									settlement={settlement}
									className={styles.settlement}
									light
								/>
							);
						})
					)}
				</div>
			</Card>
		</section>
	);
}
