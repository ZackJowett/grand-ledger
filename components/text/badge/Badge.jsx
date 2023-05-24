import styles from "./Badge.module.scss";

export default function Badge({ title = "", color = "open", className }) {
	return (
		<div
			className={`${styles.badge} ${
				color == "open"
					? styles.open
					: color == "pending"
					? styles.pending
					: styles.closed
			} ${className ? className : ""}`}>
			{title}
		</div>
	);
}
