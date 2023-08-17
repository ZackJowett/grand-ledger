import Link from "next/link";
import styles from "./Card.module.scss";
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
	reverseAction,
	smallPadding,
}) {
	const badgeColor =
		badge == "Outstanding" || badge == "Unreceived"
			? styles.open
			: badge == "Pending"
			? styles.pending
			: badge == "Reopened"
			? styles.open
			: styles.closed;

	if (href) {
		return (
			<Link
				href={href}
				className={`${styles.card} ${styles.clickable} ${
					action ? styles.includeAction : ""
				} ${reverseAction ? styles.reverseAction : ""} ${
					className ? className : ""
				} `}>
				<div
					className={`${styles.contentWrapper} ${
						light ? styles.light : ""
					} ${smallPadding ? styles.smallPadding : ""}`}>
					<div className={styles.content}>
						<div className={styles.header}>
							<div className={styles.titleWrapper}>
								<p
									className={`${styles.pretitle} ${
										pretitleClassName
											? pretitleClassName
											: ""
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
								<div
									className={`${styles.badge} ${badgeColor}`}>
									{badge}
								</div>
							)}
						</div>
						<div className={styles.children}>{children}</div>
					</div>
					{includeArrow && <IconArrow className={styles.arrow} />}
				</div>
				{action && (
					<div
						className={`${styles.action} ${
							light ? styles.actionLight : ""
						}`}>
						{action}
					</div>
				)}
			</Link>
		);
	} else {
		return (
			<div
				className={`${styles.card} ${
					action ? styles.includeAction : ""
				} ${reverseAction ? styles.reverseAction : ""} ${
					className ? className : ""
				} `}>
				<div
					className={`${styles.contentWrapper} ${
						light ? styles.light : ""
					} ${smallPadding ? styles.smallPadding : ""}`}>
					<div className={styles.content}>
						{pretitle ||
							title ||
							badge ||
							(subtitle && (
								<div className={styles.header}>
									<div className={styles.titleWrapper}>
										<p
											className={`${styles.pretitle} ${
												pretitleClassName
													? pretitleClassName
													: ""
											}`}>
											{pretitle}
										</p>
										<h3
											className={`${styles.title} ${
												titleClassName
													? titleClassName
													: ""
											}`}>
											{title}
										</h3>
										<p className={styles.subtitle}>
											{subtitle}
										</p>
									</div>

									{badge && (
										<div
											className={`${styles.badge} ${badgeColor}`}>
											{badge}
										</div>
									)}
								</div>
							))}
						<div className={styles.children}>{children}</div>
					</div>
					{includeArrow && <IconArrow className={styles.arrow} />}
				</div>
				{action && (
					<div
						className={`${styles.action} ${
							light ? styles.actionLight : ""
						}`}>
						{action}
					</div>
				)}
			</div>
		);
	}
}
