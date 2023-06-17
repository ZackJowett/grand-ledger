import Link from "next/link";
import styles from "./Button.module.scss";
import Spinner from "../placeholders/spinner/Spinner";

interface Props {
	className?: string;
	title: any | React.ReactNode;
	href?: string;
	onClick?: Function;
	dark?: boolean;
	submit?: boolean;
	disabled?: boolean;
	icon?: any | React.ReactNode;
	secondary?: boolean;
	loading?: boolean;
}

export default function Button({
	className,
	title,
	href,
	dark,
	submit,
	onClick = null,
	disabled = false,
	icon,
	secondary = false,
	loading = false,
}: Props) {
	let classes = className ? className : "";
	classes += dark ? styles.dark : "";
	classes += disabled ? styles.disabled : "";
	classes += icon ? styles.icon : "";
	classes += secondary ? styles.secondary : "";

	return (
		<>
			{href ? (
				<Link href={href} className={`${classes} ${styles.link}`}>
					{loading ? (
						<Spinner spinnerClassName={styles.spinnerBlocks} />
					) : (
						<>
							{icon && icon}
							{title}
						</>
					)}
				</Link>
			) : (
				<button
					type={submit ? "submit" : "button"}
					className={`${classes} ${styles.submit} `}
					disabled={disabled}
					onClick={
						onClick
							? () => onClick()
							: () => {
									return;
							  }
					}>
					{loading ? (
						<Spinner spinnerClassName={styles.spinnerBlocks} />
					) : (
						<>
							{icon && icon}
							{title}
						</>
					)}
				</button>
			)}
		</>
	);
}
