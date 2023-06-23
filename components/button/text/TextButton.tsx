import styles from "./TextButton.module.scss";
import Link from "next/link";

interface Props {
	title: string;
	text: string;
	link?: string;
	onClick?: Function;
	className: string;
}

export default function TextButton({
	title,
	text,
	link = "",
	onClick,
	className,
}: Props) {
	return (
		<div className={`${styles.wrapper} ${className ? className : ""}`}>
			{link ? (
				<p>
					{text ? text + " " : null}
					<Link href={link} className={styles.clickable}>
						{title}
					</Link>
				</p>
			) : onClick ? (
				<p>
					{text ? text + " " : null}
					<span
						onClick={() => onClick()}
						className={styles.clickable}>
						{title}
					</span>
				</p>
			) : null}
		</div>
	);
}
