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
import ClickableCard from "/components/card/ClickableCard";

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
						<div className={styles.wrapper}>
							<ClickableCard
								className={styles.netWrapper}
								action={
									<p className={styles.action}>
										Net Position
									</p>
								}
								reverseAction>
								<Money
									amount={stats.current.net}
									notColoured
									includeSign
								/>
							</ClickableCard>
							<div className={styles.individualDebtTotals}>
								<ClickableCard
									className={styles.debtWrapper}
									href="/debts"
									action={
										<p className={styles.action}>
											Total Debt
										</p>
									}
									reverseAction
									includeArrow>
									<Money amount={stats.current.debt} />
								</ClickableCard>

								<ClickableCard
									className={styles.unreceivedWrapper}
									href="/unreceived-payments"
									action={
										<p className={styles.action}>
											Total Unreceived
										</p>
									}
									reverseAction
									includeArrow>
									<Money amount={stats.current.unreceived} />
								</ClickableCard>
							</div>
						</div>
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
