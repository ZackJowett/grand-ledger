import styles from "./Money.module.scss";

export default function Money({ amount, className, includeSign = false }) {
	return (
		<span className={`${className ? className : ""} ${styles.money}`}>
			<span className={styles.sign}>$</span>{" "}
			{includeSign ? (amount < 0 ? "-" : "+") : ""}
			{Math.abs(amount).toFixed(2).toLocaleString("en-US")}
		</span>
	);
}
