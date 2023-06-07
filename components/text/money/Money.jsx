import styles from "./Money.module.scss";

export default function Money({
	amount,
	className,
	includeSign = false,
	background = false,
	backgroundDark = false,
	small = false,
	notColoured = false,
}) {
	// Set classes
	let classes = `${styles.money}`;
	if (className) classes += ` ${className}`;
	if (background) classes += ` ${styles.background}`;
	if (backgroundDark) classes += ` ${styles.backgroundDark}`;
	if (small) classes += ` ${styles.small}`;
	if (!notColoured)
		classes += ` ${amount < 0 ? styles.negative : styles.positive}`;

	return (
		<span className={classes}>
			<span className={styles.sign}>$</span>{" "}
			{includeSign ? (amount < 0 ? "-" : "+") : ""}
			{Math.abs(amount).toFixed(2).toLocaleString("en-US")}
		</span>
	);
}
