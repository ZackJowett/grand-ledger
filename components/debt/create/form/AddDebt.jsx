import styles from "./AddDebt.module.scss";
import Card from "components/card/Card";
import Button from "components/button/Button";
import { MdPerson, MdGroups } from "react-icons/md";
import TextWithTitle from "components/text/title/TextWithTitle";

export default function AddDebt({ numDebts, addSingle, addMulti }) {
	const maxDebts = 10;

	return (
		<>
			<Card className={styles.card}>
				<hr />
				<TextWithTitle
					title="Add"
					text="up to 10 debts at once"
					align="left"
					className={styles.title}
				/>
				{numDebts.total >= maxDebts ? (
					<p className={styles.max}>
						Maximum quantity reached
						<br />
						Submit current debts, then create more
					</p>
				) : (
					<>
						<div className={styles.buttons}>
							<div className={styles.buttonWrapper}>
								<Button
									title={
										<p className={styles.button}>
											<MdPerson />
											Singular Debt
										</p>
									}
									onClick={() => addSingle()}
								/>
								<TextWithTitle
									title={numDebts.single}
									className={styles.count}
								/>
							</div>
							<div className={styles.buttonWrapper}>
								<Button
									title={
										<p className={styles.button}>
											<MdGroups />
											Multi Debt
										</p>
									}
									onClick={() => addMulti()}
								/>
								<TextWithTitle
									title={numDebts.multi}
									className={styles.count}
								/>
							</div>
						</div>
					</>
				)}
				<hr />
			</Card>
		</>
	);
}
