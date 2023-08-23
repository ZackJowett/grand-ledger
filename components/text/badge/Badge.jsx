import styles from "./Badge.module.scss";

export default function Badge({ title = "", color = "open", className }) {
	return (
		<div
			className={`${styles.badge} ${
				color == "reopened" ||
				color == "open" ||
				color == "unreceived" ||
				color == "outstanding"
					? styles.open
					: color == "pending"
					? styles.pending
					: color == "group"
					? styles.group
					: styles.closed
			} ${className ? className : ""}`}>
			{title}
		</div>
	);
}
