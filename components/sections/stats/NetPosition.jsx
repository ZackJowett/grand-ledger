import Card from "/components/card/Card";
import { useEffect, useState } from "react";
import { getUserStats } from "/utils/data/users";
import Money from "/components/text/money/Money";
import TextWithButton from "/components/text/title/TextWithButton";
import TextWithTitle from "components/text/title/TextWithTitle";
import { useSession } from "next-auth/react";
import styles from "./NetPosition.module.scss";
import { NetPositionPlaceholder } from "/components/placeholders/Placeholders";
import { useUserStats } from "/utils/hooks";
import Spinner from "/components/placeholders/spinner/Spinner";

export default function NetPosition() {
	const { data: session } = useSession();
	const {
		data: stats,
		isLoading: statsLoading,
		isError: statsError,
	} = useUserStats(session ? session.user.id : null);

	if (!session) return;

	return (
		<>
			{statsLoading ? (
				<Spinner />
			) : stats ? (
				<>
					{stats.current.net != 0 && (
						<>
							{/* <TextWithTitle
								title={
									<Money
										amount={stats.current.net}
										includeSign
									/>
								}
								text="Net Position"
								large
								className={`${
									stats.current.net >= 0
										? styles.positive
										: styles.negative
								} ${styles.netPosition}
						`}
							/> */}
							<div className={styles.stats}>
								<TextWithTitle
									text="Total Debt"
									title={
										<Money
											amount={stats.current.debt}
											className={styles.debt}
										/>
									}
									// buttonTitle="PAY NOW"
									link="/settlements/create"
									align="left"
									large
									className={styles.totalDebt}
								/>
								<TextWithTitle
									text="Total Unreceived Payments"
									title={
										<Money
											amount={stats.current.unreceived}
											className={styles.unreceived}
										/>
									}
									// buttonTitle="VIEW"
									link="/unreceived-payments"
									align="left"
									large
									className={styles.totalUnreceived}
								/>
							</div>
						</>
					)}

					{stats.current.net == 0 && (
						<TextWithTitle
							text={"No outstanding debts or unreceived payments"}
							className={styles.noDebts}
							small
						/>
					)}
				</>
			) : (
				<NetPositionPlaceholder />
			)}
		</>
	);
}
