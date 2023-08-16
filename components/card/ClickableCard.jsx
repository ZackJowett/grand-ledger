import Link from "next/link";
import styles from "./ClickableCard.module.scss";
import { IconArrow } from "/components/icons";

export default function ClickableCard({
	pretitle,
	title,
	subtitle,
	badge,
	children,
	href,
	className,
	titleClassName,
	pretitleClassName,
	includeArrow,
	action,
	light,
}) {
	const badgeColor =
		badge == "Outstanding" || badge == "Unreceived"
			? styles.open
			: badge == "Pending"
			? styles.pending
			: badge == "Reopened"
			? styles.open
			: styles.closed;

	return (
		<Link
			href={href}
			className={`${styles.card} ${styles.clickable} ${
				action ? styles.includeAction : ""
			} ${className ? className : ""} `}>
			<div
				className={`${styles.contentWrapper} ${
					light ? styles.light : ""
				}`}>
				<div className={styles.content}>
					<div className={styles.header}>
						<div className={styles.titleWrapper}>
							<p
								className={`${styles.pretitle} ${
									pretitleClassName ? pretitleClassName : ""
								}`}>
								{pretitle}
							</p>
							<h3
								className={`${styles.title} ${
									titleClassName ? titleClassName : ""
								}`}>
								{title}
							</h3>
							<p className={styles.subtitle}>{subtitle}</p>
						</div>

						{badge && (
							<div className={`${styles.badge} ${badgeColor}`}>
								{badge}
							</div>
						)}
					</div>
					<div className={styles.children}>{children}</div>
				</div>
				{includeArrow && <IconArrow className={styles.arrow} />}
			</div>
			{action && <div className={styles.action}>{action}</div>}
		</Link>
	);
}
