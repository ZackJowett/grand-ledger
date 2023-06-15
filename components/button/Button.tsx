import Link from "next/link";
import styles from "./Button.module.scss";

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
}: Props) {
	return (
		<>
			{href ? (
				<Link
					href={href}
					className={`${className ? className : ""} ${styles.link} ${
						dark ? styles.dark : ""
					} ${disabled ? styles.disabled : ""} ${
						icon ? styles.icon : ""
					} ${secondary ? styles.secondary : ""}`}>
					{icon && icon}
					{title}
				</Link>
			) : (
				<button
					type={submit ? "submit" : "button"}
					className={`${className ? className : ""} ${
						styles.submit
					} ${dark ? styles.dark : ""} ${
						disabled ? styles.disabled : ""
					}  ${icon ? styles.icon : ""} ${
						secondary ? styles.secondary : ""
					}`}
					disabled={disabled}
					onClick={
						onClick
							? () => onClick()
							: () => {
									return;
							  }
					}>
					{icon && icon}
					{title}
				</button>
			)}
		</>
	);
}
