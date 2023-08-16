import styles from "./Card.module.scss";
import Link from "next/link";

export default function Card({
	pretitle,
	title,
	subtitle,
	badge,
	children,
	className,
	dark,
	link = null,
}) {
	const badgeColor =
		badge == "Open"
			? styles.open
			: badge == "Pending"
			? styles.pending
			: styles.closed;

	return (
		<section
			className={`${className} ${styles.card} ${
				dark ? styles.dark : ""
			}`}>
			<div className={styles.content}>
				{link ? (
					<Link className={styles.header} href={link}>
						<div className={styles.titleWrapper}>
							<p className={styles.pretitle}>{pretitle}</p>
							<h3 className={styles.title}>{title}</h3>
							<p className={styles.subtitle}>{subtitle}</p>
						</div>

						{badge && (
							<div className={`${styles.badge} ${badgeColor}`}>
								{badge}
							</div>
						)}
					</Link>
				) : (
					<div className={styles.header}>
						<div className={styles.titleWrapper}>
							<p className={styles.pretitle}>{pretitle}</p>
							<h3 className={styles.title}>{title}</h3>
							<p className={styles.subtitle}>{subtitle}</p>
						</div>

						{badge && (
							<div className={`${styles.badge} ${badgeColor}`}>
								{badge}
							</div>
						)}
					</div>
				)}

				{children}
			</div>
		</section>
	);
}
