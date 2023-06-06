import styles from "./Spinner.module.scss";

export default function Spinner({ title = "" }) {
	return (
		<div className={styles.wrapper}>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				className={styles.svg}>
				<rect
					className={styles.spinner1}
					x="1"
					y="1"
					rx="1"
					width="10"
					height="10"
				/>
				<rect
					className={styles.spinner2}
					x="1"
					y="1"
					rx="1"
					width="10"
					height="10"
				/>
				<rect
					className={styles.spinner3}
					x="1"
					y="1"
					rx="1"
					width="10"
					height="10"
				/>
			</svg>
			<h5 className={styles.title}>{title}</h5>
		</div>
	);
}
