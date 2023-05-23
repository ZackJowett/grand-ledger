import styles from "./InfoBanner.module.scss";

export default function InfoBanner({ title, subtitle, children }) {
	return (
		<section className={styles.banner}>
			<div className={styles.titleWrapper}>
				<h3 className={styles.title}>{title}</h3>
				<p className={styles.subtitle}>{subtitle}</p>
			</div>
			<div className={styles.children}>{children}</div>
		</section>
	);
}
