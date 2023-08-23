import styles from "./TextWithTitle.module.scss";
import Link from "next/link";

interface Props {
	className?: string;
	title: string;
	text?: string;
	align?: "left" | "center" | "right";
	small?: boolean;
	large?: boolean;
	tiny?: boolean;
	reverse?: boolean;
	background?: boolean;
	backgroundFit?: boolean;
	link?: string;
	onClick?: () => void;
	titleClassName?: string;
}

export default function TextWithTitle({
	className,
	title,
	text,
	align = "center",
	small,
	tiny,
	link,
	large,
	reverse,
	background,
	backgroundFit,
	onClick,
	titleClassName,
}: Props) {
	// Add classes to class prop
	let classes = styles.wrapper;
	if (className) classes += " " + className;
	if (small) classes += " " + styles.small;
	if (large) classes += " " + styles.large;
	if (reverse) classes += " " + styles.reverse;
	if (background) classes += " " + styles.background;
	if (backgroundFit) classes += " " + styles.backgroundFit;
	if (onClick) classes += " " + styles.clickable;
	if (align === "left") classes += " " + styles.left;
	if (align === "center") classes += " " + styles.center;
	if (align === "right") classes += " " + styles.right;

	if (link) {
		return (
			<Link className={classes} onClick={onClick} href={link}>
				{small ? (
					<h4
						className={`${styles.title} ${
							titleClassName ? titleClassName : ""
						}`}>
						{title}
					</h4>
				) : large ? (
					<h1
						className={`${styles.title} ${
							titleClassName ? titleClassName : ""
						}`}>
						{title}
					</h1>
				) : tiny ? (
					<p
						className={`${styles.title} ${
							titleClassName ? titleClassName : ""
						}`}>
						{title}
					</p>
				) : (
					<h2
						className={`${styles.title} ${
							titleClassName ? titleClassName : ""
						}`}>
						{title}
					</h2>
				)}

				{text && <p className={styles.text}>{text}</p>}
			</Link>
		);
	}

	return (
		<div className={classes} onClick={onClick}>
			{small ? (
				<h4
					className={`${styles.title} ${
						titleClassName ? titleClassName : ""
					}`}>
					{title}
				</h4>
			) : large ? (
				<h1
					className={`${styles.title} ${
						titleClassName ? titleClassName : ""
					}`}>
					{title}
				</h1>
			) : tiny ? (
				<p
					className={`${styles.title} ${
						titleClassName ? titleClassName : ""
					}`}>
					{title}
				</p>
			) : (
				<h2
					className={`${styles.title} ${
						titleClassName ? titleClassName : ""
					}`}>
					{title}
				</h2>
			)}

			{text && <p className={styles.text}>{text}</p>}
		</div>
	);
}
