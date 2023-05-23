import styles from "./TextButton.module.scss";

interface Props {
	title: string;
	link?: string;
	onClick?: Function;
}

export default function TextButton({ title, link = "", onClick }: Props) {
	return (
		<div className={styles.wrapper}>
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
