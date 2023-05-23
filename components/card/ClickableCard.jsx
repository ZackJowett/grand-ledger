import Link from "next/link";
import styles from "./Card.module.scss";

export default function ClickableCard({
	pretitle,
	title,
	subtitle,
	badge,
	children,
	href,
	className,
}) {
	const badgeColor =
		badge == "Open"
			? styles.open
			: badge == "Pending"
			? styles.pending
			: styles.closed;

	return (
		<Link
			href={href}
			className={`${styles.card} ${className ? className : ""} `}>
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
			<div className={styles.children}>{children}</div>
		</Link>
	);
}
