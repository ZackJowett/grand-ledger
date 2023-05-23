import Button from "../../button/Button";
import styles from "./TextWithTitle.module.scss";
import Link from "next/link";

interface Props {
	className?: string;
	title: string;
	text: string;
	buttonTitle: string;
	link: string;
	align?: "left" | "center" | "right";
	small?: boolean;
	large?: boolean;
	reverse?: boolean;
}

export default function TextWithTitle({
	className,
	title,
	text,
	align = "center",
	small,
	large,
	reverse,
	buttonTitle,
	link,
}: Props) {
	return (
		<div
			className={`${className} ${styles.wrapper} ${
				small ? styles.small : ""
			} ${large ? styles.large : ""} ${reverse ? styles.reverse : ""}`}
			style={{ textAlign: align }}>
			<Link className={styles.buttonWrapper} href={link}>
				{small ? (
					<h4 className={styles.title}>{title}</h4>
				) : large ? (
					<h1 className={styles.title}>{title}</h1>
				) : (
					<h2 className={styles.title}>{title}</h2>
				)}

				<Button
					href={link}
					title={buttonTitle}
					className={styles.button}
				/>
			</Link>

			<p className={styles.text}>{text}</p>
		</div>
	);
}
