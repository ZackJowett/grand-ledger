import styles from "./Money.module.scss";
import { IconDebt, IconUnreceieved } from "/components/icons";

export default function Money({
	amount,
	className,
	includeSign = false,
	background = false,
	backgroundDark = false,
	backgroundFit = false,
	padding = false,
	small = false,
	notColoured = false,
}) {
	// Set classes
	let classes = `${styles.money}`;
	if (className) classes += ` ${className}`;
	if (background) classes += ` ${styles.background}`;
	if (backgroundDark) classes += ` ${styles.backgroundDark}`;
	if (backgroundFit) classes += ` ${styles.backgroundFit}`;
	if (padding) classes += ` ${styles.padding}`;
	if (small) classes += ` ${styles.small}`;
	if (!notColoured)
		classes += ` ${amount < 0 ? styles.negative : styles.positive}`;

	return (
		<span className={classes}>
			{notColoured || amount < 0 ? <IconDebt /> : <IconUnreceieved />}
			{includeSign ? (amount < 0 ? "-" : "+") : ""}
			{Math.abs(amount).toFixed(2).toLocaleString("en-US")}
		</span>
	);
}
