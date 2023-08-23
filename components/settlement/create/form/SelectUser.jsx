import Card from "components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./SelectUser.module.scss";
import { useSession } from "next-auth/react";
import Spinner from "components/placeholders/spinner/Spinner";
import Money from "components/text/money/Money";
import Select from "components/forms/Select";
import { useRouter } from "next/router";
import {
	useUsers,
	useUserDebtStats,
	useSettlementsBetweenUsers,
} from "utils/hooks";
import DebtsIncluded from "components/settlement/create/DebtsIncluded";
import Settlement from "components/settlement/Settlement";

export default function SelectUser({
	debts,
	selectedUser,
	setSelectedUser,
	selectedDebts,
	setSelectedDebts,
	stats,
	group,
}) {
	const { data: session } = useSession();
	const router = useRouter();
	const users = useUsers();
	const { data: userStats, isLoading: userStatsLoading } = useUserDebtStats(
		session.user.id
	);
	const existingSettlements = useSettlementsBetweenUsers(
		session.user.id,
		selectedUser?._id,
		group.data ? group.data._id : null
	);

	function handleSelectParty(selectedOption) {
		const selectedUser = users.data.find(
			(user) => user._id == selectedOption.value
		);

		setSelectedUser(selectedUser);
	}

	let options = [];

	if (users.exists) {
		// Create options
		options = users.data
			.map((user) => {
				if (user._id == session.user.id) return;
				return {
					value: user._id,
					label: getUserLabel(user, userStats, userStatsLoading),
				};
			})
			.filter((item) => item);

		// If selectedUser is null, set to user with id in query
		if (selectedUser === null && router.query.id) {
			// find user
			const newSelectedUser = options.find(
				(entry) => entry.value == router.query.id
			);
			if (newSelectedUser) {
				handleSelectParty(newSelectedUser);
			} else if (options.length <= 0) {
				// If no users, set selectedUser to null
				setSelectedUser(null);
			} else if (options.length > 0 && selectedUser === null) {
				// If no options, set selectedUser to first user
				handleSelectParty(options[0]);
			}
		} else if (options.length <= 0) {
			// If no users, set selectedUser to null
			setSelectedUser(null);
		} else if (options.length > 0 && selectedUser === null) {
			// If no options, set selectedUser to first user
			handleSelectParty(options[0]);
		}
	}

	return (
		<section className={styles.wrapper}>
			<TextWithTitle
				title={`Who do you want to settle with?`}
				className={styles.header}
				align="left"
			/>
			{users.exists && selectedUser && (
				<Select
					options={options}
					className={styles.select}
					defaultValue={
						router.query.id
							? options.find(
									(entry) => entry.value == router.query.id
							  )
							: options[0]
					}
					onChange={handleSelectParty}
				/>
			)}

			{existingSettlements.exists &&
				existingSettlements.data.length > 0 && (
					<ExistingSettlements
						existingSettlements={existingSettlements}
					/>
				)}
			<Card dark>
				<div className={styles.stats} id="settlement-standings">
					<div className={styles.debts}>
						<Card
							className={styles.debt}
							action={
								selectedUser
									? `You owe ${selectedUser.name}`
									: " "
							}
							reverseAction
							light
							smallPadding>
							{debts.isLoading || !stats ? (
								<Spinner />
							) : debts.isError || !debts ? (
								<p className={styles.loading}>---</p>
							) : (
								<Money
									amount={stats.totalDebt}
									className={styles.debtAmount}
								/>
							)}
						</Card>
						<Card
							className={styles.unreceived}
							action={
								selectedUser
									? `${selectedUser.name} owes you`
									: " "
							}
							reverseAction
							light
							smallPadding>
							{debts.isLoading || !stats ? (
								<Spinner />
							) : debts.isError || !debts ? (
								<p className={styles.loading}>---</p>
							) : (
								<Money amount={stats.totalUnreceived} />
							)}
						</Card>
					</div>
					<Card
						className={styles.netWrapper}
						action={
							selectedUser && stats
								? stats.net > 0
									? `Total ${selectedUser.name}
										owes you`
									: `Total you owe ${selectedUser.name}`
								: " "
						}
						reverseAction
						light
						smallPadding>
						{debts.isLoading || !stats ? (
							<Spinner />
						) : debts.isError || !debts ? (
							<p className={styles.loading}>---</p>
						) : (
							<Money amount={stats.net} notColoured />
						)}
					</Card>
				</div>
				<DebtsIncluded
					debts={debts}
					selectedDebts={selectedDebts}
					setSelectedDebts={setSelectedDebts}
					netPosition={stats ? stats.net : null}
				/>
			</Card>
		</section>
	);
}

function getUserLabel(user, stats, loading) {
	// Statistics not loaded yet
	if (!stats) {
		return;
	}
	if (loading) {
		return `${user.name} - ...`;
	}

	// User has no debt
	if (!stats.find((stat) => stat.id == user._id)) {
		return `${user.name} - 0`;
	}

	const net = stats.find((stat) => stat.id == user._id)?.amountNet;

	return `${user.name} | ${net > 0 ? "+" : ""}${net}`;
	{
		/* <span
				className={
					net < 0 ? styles.selectDebt : styles.selectUnreceived
				}>
				${net}
			</span> */
	}
	{
		/* // </> */
	}
}

function ExistingSettlements({ existingSettlements }) {
	return (
		<Card className={styles.debt}>
			<div className={styles.settlementWrapper}>
				<TextWithTitle
					title={`Existing Settlements`}
					className={styles.header}
					align="left"
				/>

				{existingSettlements.data.map((settlement) => {
					return (
						<Settlement
							settlement={settlement}
							key={settlement.id}
							light
						/>
					);
				})}
			</div>
		</Card>
	);
}
