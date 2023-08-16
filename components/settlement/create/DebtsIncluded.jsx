import Debt from "../../debt/Debt";
import styles from "./DebtsIncluded.module.scss";
import Spinner from "components/placeholders/spinner/Spinner";
import Title from "components/text/title/TextWithTitle";

export default function DebtsIncluded({ debts }) {
	return (
		<section className={styles.wrapper}>
			<Title
				title="Debts Included"
				align="left"
				className={styles.title}
			/>
			{!debts ? (
				<Spinner />
			) : (
				debts.map((debt) => {
					return (
						<Debt
							debt={debt}
							key={debt.id ? debt.id : debt._id}
							light
						/>
					);
				})
			)}
		</section>
	);
}
