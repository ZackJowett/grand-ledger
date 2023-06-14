import styles from "./UserStatistics.module.scss";
import Card from "components/card/Card";
import TextWithTitle from "components/text/title/TextWithTitle";
import Spinner from "components/placeholders/spinner/Spinner";
import { useEffect, useState } from "react";
import { getUserStats } from "utils/data/users";
import Money from "components/text/money/Money";

export default function UserStatistics({ user }) {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState(null);

	useEffect(() => {
		if (!user) return;
		// Get user stats
		getUserStats(user._id)
			.then((res) => {
				setStats(res);
			})
			.then(() => {
				setLoading(false);
			});
	}, [user]);

	return (
		<Card title="Your Life Acheivements" dark>
			<div className={styles.wrapper}>
				{loading ? (
					<Spinner title="Loading user statistics..." />
				) : (
					<>
						{!stats ? (
							<p>Error loading stats.</p>
						) : (
							<>
								<Card title="Overall">
									<hr className={styles.hr} />
									<TextWithTitle
										title={"Total"}
										className={styles.title}
										align="left"
										reverse
										small
									/>
									<div className={styles.debts}>
										<div className={styles.row}>
											<TextWithTitle
												text="Paid"
												title={
													<Money
														amount={
															stats.total
																.paidAmount
														}
														className={styles.red}
														backgroundDark
														small
													/>
												}
												className={styles.debtData}
												align="left"
												reverse
											/>
											<TextWithTitle
												text="Pending"
												title={
													<Money
														amount={
															stats.total
																.pendingAmount
														}
														className={
															styles.orange
														}
														small
														backgroundDark
													/>
												}
												className={styles.debtData}
												reverse
											/>
											<TextWithTitle
												text="Received"
												title={
													<Money
														amount={
															stats.total
																.receivedAmount
														}
														className={styles.green}
														small
														backgroundDark
													/>
												}
												className={styles.debtData}
												align="right"
												reverse
											/>
										</div>
									</div>
								</Card>
								<Card title="Debts">
									<hr className={styles.hr} />
									<TextWithTitle
										title={"Current"}
										className={styles.title}
										align="left"
										reverse
										small
									/>
									<div className={styles.debts}>
										<div className={styles.row}>
											<TextWithTitle
												text="Outstanding"
												title={stats.debts.outstanding}
												className={styles.debtData}
												align="center"
												reverse
											/>
											<TextWithTitle
												text="Pending"
												title={stats.debts.pending}
												className={styles.debtData}
												align="center"
												reverse
											/>
											<TextWithTitle
												text="Closed"
												title={stats.debts.closed}
												className={styles.debtData}
												align="center"
												reverse
											/>
										</div>
										<div className={styles.row}>
											<TextWithTitle
												text="Outstanding"
												title={
													<Money
														amount={
															stats.current.debt
														}
														className={styles.red}
														backgroundDark
														small
													/>
												}
												className={styles.debtData}
												reverse
											/>
											<TextWithTitle
												text="Unreceived"
												title={
													<Money
														amount={
															stats.current
																.unreceived
														}
														className={styles.green}
														small
														backgroundDark
													/>
												}
												className={styles.debtData}
												reverse
											/>
										</div>
									</div>
								</Card>
								<Card title="Settlements">
									<hr className={styles.hr} />
									<TextWithTitle
										title={"Total"}
										className={styles.title}
										align="left"
										reverse
										small
									/>
									<div className={styles.debts}>
										<div className={styles.row}>
											<TextWithTitle
												text="Closed"
												title={stats.settlements.closed}
												className={styles.debtData}
												reverse
											/>
											<TextWithTitle
												text="Pending"
												title={
													stats.settlements.pending
												}
												className={styles.debtData}
												reverse
											/>
											<TextWithTitle
												text="Reopened"
												title={
													stats.settlements.reopened
												}
												className={styles.debtData}
												reverse
											/>
										</div>
									</div>
								</Card>
							</>
						)}
					</>
				)}
			</div>
		</Card>
	);
}
