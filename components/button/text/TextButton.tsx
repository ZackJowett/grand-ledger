import styles from "./TextButton.module.scss";

interface Props {
	title: string;
	link?: string;
	onClick?: Function;
	className: string;
}

export default function TextButton({
	title,
	link = "",
	onClick,
	className,
}: Props) {
	return (
		<div className={`${styles.wrapper} ${className ? className : ""}`}>
			{link ? (
				<a href={link} className={styles.text}>
					{title}
				</a>
			) : onClick ? (
				<p onClick={() => onClick()} className={styles.text}>
					{title}
				</p>
			) : null}
		</div>
	);
}
