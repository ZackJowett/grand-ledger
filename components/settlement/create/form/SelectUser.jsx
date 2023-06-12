import Card from "components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./SelectUser.module.scss";
import { useSession } from "next-auth/react";
import Spinner from "components/placeholders/spinner/Spinner";
import Money from "components/text/money/Money";
import Select from "components/forms/Select";

export default function SelectUser({
	users,
	debts,
	selectedUser,
	setSelectedUser,
	stats,
}) {
	const { data: session } = useSession();

	function handleSelectParty(selectedOption) {
		const selectedUser = users.find(
			(user) => user._id == selectedOption.value
		);
		setSelectedUser(selectedUser);
	}

	const options = users
		.map((user) => {
			if (user._id == session.user.id) return;
			return { value: user._id, label: user.name };
		})
		.filter((item) => item);

	console.log(options);

	return (
		<section className={styles.wrapper}>
			<TextWithTitle
				title={`Who do you want to settle with?`}
				className={styles.header}
				align="left"
			/>
			{!users ? (
				<Spinner title="Loading users..." />
			) : (
				<Card dark>
					<Select
						options={options}
						className={styles.select}
						defaultValue={options[0]}
						onChange={handleSelectParty}
					/>

					{!debts ? (
						<Spinner title="Loading debts..." />
					) : (
						<div className={styles.stats}>
							<div className={styles.debts}>
								<TextWithTitle
									title={`${selectedUser.name} owes you`}
									text={
										<Money
											amount={stats.totalUnreceived}
											background
											small
										/>
									}
									className={styles.amount}
									align="left"
									tiny
								/>
								<TextWithTitle
									title={`You owe ${selectedUser.name}`}
									text={
										<Money
											amount={stats.totalDebt}
											background
											small
										/>
									}
									className={styles.amount}
									align="right"
									tiny
								/>
							</div>
							<hr className={styles.hr} />
							<div>
								<TextWithTitle
									title={`Net Position`}
									text={
										<Money
											amount={stats.net}
											includeSign
											background
										/>
									}
									className={styles.header}
									small
								/>

								<p className={styles.info}>
									{stats.net > 0
										? `${selectedUser.name} must pay you`
										: stats.net < 0
										? `You must pay ${selectedUser.name}`
										: "You are even"}
								</p>
							</div>
						</div>
					)}
				</Card>
			)}
		</section>
	);
}
