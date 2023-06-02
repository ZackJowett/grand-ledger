import styles from "./Toggle.module.scss";

export default function Toggle({ title, active = false, icon, onClick }) {
	return (
		<div
			className={`${styles.wrapper} ${active ? styles.active : ""}`}
			onClick={onClick}>
			<div className={styles.icon}>{icon}</div>
			{title}
		</div>
	);
}
