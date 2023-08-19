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
}) {
	const { data: session } = useSession();
	const router = useRouter();
	const {
		data: users,
		isLoading: usersLoading,
		error: usersError,
	} = useUsers();
	const { data: userStats, isLoading: userStatsLoading } = useUserDebtStats(
		session.user.id
	);
	const {
		data: existingSettlements,
		isLoading: existingSettlementsLoading,
		error: existingSettlementsError,
	} = useSettlementsBetweenUsers(session.user.id, selectedUser?._id);

	function handleSelectParty(selectedOption) {
		const selectedUser = users.find(
			(user) => user._id == selectedOption.value
		);

		setSelectedUser(selectedUser);
	}

	console.log(existingSettlements);

	let options = [];

	if (!usersLoading && !usersError && !userStatsLoading) {
		// Create options
		options = users
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
			handleSelectParty(
				options.find((entry) => entry.value == router.query.id)
			);
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
			{users && selectedUser && (
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

			{!existingSettlementsLoading &&
				existingSettlements &&
				existingSettlements.length > 0 && (
					<Card className={styles.debt}>
						<div className={styles.settlementWrapper}>
							<TextWithTitle
								title={`Existing Settlements`}
								className={styles.header}
								align="left"
							/>

							{existingSettlements.map((settlement) => {
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
							{!debts || !stats ? (
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
							{!debts || !stats ? (
								<p className={styles.loading}>---</p>
							) : (
								<Money amount={stats.totalUnreceived} />
							)}
						</Card>
					</div>
					<Card
						className={styles.netWrapper}
						action={
							selectedUser
								? stats.net > 0
									? `Total ${selectedUser.name}
										owes you`
									: `Total you owe ${selectedUser.name}`
								: " "
						}
						reverseAction
						light
						smallPadding>
						{!debts || !stats ? (
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
