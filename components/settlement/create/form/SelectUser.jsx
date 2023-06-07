import Card from "components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./SelectUser.module.scss";
import { useSession } from "next-auth/react";
import Spinner from "components/placeholders/spinner/Spinner";
import Money from "components/text/money/Money";

export default function SelectUser({
	users,
	debts,
	selectedUser,
	setSelectedUser,
	stats,
}) {
	const { data: session } = useSession();

	function handleSelectParty(e) {
		const selectedUser = users.find((user) => user._id == e.target.value);
		setSelectedUser(selectedUser);
	}

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
					<select
						name="otherParty"
						id="otherParty"
						disabled={!users}
						onChange={handleSelectParty}
						className={styles.select}>
						{users.map((user, index) => {
							if (user._id != session.user.id)
								return (
									<option value={user._id} key={index}>
										{user.name}
									</option>
								);
						})}
					</select>

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
