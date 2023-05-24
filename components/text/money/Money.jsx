import styles from "./Money.module.scss";

export default function Money({
	amount,
	className,
	includeSign = false,
	background = false,
	small = false,
}) {
	return (
		<span
			className={`${className ? className : ""} ${styles.money} ${
				background ? styles.background : ""
			} ${small ? styles.small : ""} `}>
			<span className={styles.sign}>$</span>{" "}
			{includeSign ? (amount < 0 ? "-" : "+") : ""}
			{Math.abs(amount).toFixed(2).toLocaleString("en-US")}
		</span>
	);
}
