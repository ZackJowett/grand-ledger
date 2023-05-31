import styles from "./AddDebt.module.scss";
import Card from "components/card/Card";
import Button from "components/button/Button";
import { MdPerson, MdGroups } from "react-icons/md";
import TextWithTitle from "components/text/title/TextWithTitle";

export default function AddDebt({ addSingle, addMulti }) {
	return (
		<>
			<Card className={styles.card}>
				<hr />
				<TextWithTitle
					title="Add"
					align="left"
					className={styles.title}
				/>
				<div className={styles.buttons}>
					<Button
						title={
							<p className={styles.button}>
								<MdPerson />
								Singular Debt
							</p>
						}
						onClick={() => addSingle()}
					/>
					<Button
						title={
							<p className={styles.button}>
								<MdGroups />
								Multi Debt
							</p>
						}
						onClick={() => addMulti()}
					/>
				</div>
				<hr />
			</Card>
		</>
	);
}
