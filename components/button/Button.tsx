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
	alignIcon?: "center" | "left" | "right";
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
	alignIcon = "center",
}: Props) {
	let classes = className ? className : "";
	classes += dark ? " " + styles.dark : "";
	classes += disabled ? " " + styles.disabled : "";
	classes += secondary ? " " + styles.secondary : "";

	// Align icon
	classes += alignIcon === "center" ? " " + styles.iconCenter : "";
	classes += alignIcon === "left" ? " " + styles.iconLeft : "";
	classes += alignIcon === "right" ? " " + styles.iconRight : "";

	return (
		<>
			{href ? (
				<Link href={href} className={`${classes} ${styles.link}`}>
					{loading ? (
						<Spinner spinnerClassName={styles.spinnerBlocks} />
					) : (
						<>
							{icon && <div className={styles.icon}>{icon}</div>}
							<p className={styles.title}>{title}</p>
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
							{icon && <div className={styles.icon}>{icon}</div>}
							<p className={styles.title}>{title}</p>
						</>
					)}
				</button>
			)}
		</>
	);
}
