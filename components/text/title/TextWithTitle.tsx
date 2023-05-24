import styles from "./TextWithTitle.module.scss";

interface Props {
	className?: string;
	title: string;
	text?: string;
	align?: "left" | "center" | "right";
	small?: boolean;
	large?: boolean;
	tiny?: boolean;
	reverse?: boolean;
}

export default function TextWithTitle({
	className,
	title,
	text,
	align = "center",
	small,
	tiny,
	large,
	reverse,
}: Props) {
	return (
		<div
			className={`${className} ${styles.wrapper} ${
				small ? styles.small : ""
			} ${large ? styles.large : ""}${reverse ? styles.reverse : ""}`}
			style={{ textAlign: align }}>
			{small ? (
				<h4 className={styles.title}>{title}</h4>
			) : large ? (
				<h1 className={styles.title}>{title}</h1>
			) : tiny ? (
				<p className={styles.title}>{title}</p>
			) : (
				<h2 className={styles.title}>{title}</h2>
			)}

			{text && <p className={styles.text}>{text}</p>}
		</div>
	);
}
