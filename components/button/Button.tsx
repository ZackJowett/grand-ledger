import Link from "next/link";
import styles from "./Button.module.scss";
import Spinner from "../placeholders/spinner/Spinner";
import { useState } from "react";

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
	includeConfirm?: boolean;
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
	includeConfirm = false,
}: Props) {
	const [confirm, setConfirm] = useState(false);

	let classes = className ? className : "";
	classes += dark ? " " + styles.dark : "";
	classes += disabled ? " " + styles.disabled : "";
	classes += secondary ? " " + styles.secondary : "";

	// Align icon
	classes += alignIcon === "center" ? " " + styles.iconCenter : "";
	classes += alignIcon === "left" ? " " + styles.iconLeft : "";
	classes += alignIcon === "right" ? " " + styles.iconRight : "";

	if (includeConfirm) {
		return (
			<>
				{confirm ? (
					<div
						className={`${styles.buttonWrapper} ${
							confirm ? styles.open : ""
						} ${classes} `}>
						<button
							type="button"
							className={`${styles.cancel}`}
							onClick={() => setConfirm(false)}>
							Cancel
						</button>
						<button
							type="button"
							className={`${styles.confirm}`}
							onClick={() => {
								setConfirm(false);
								onClick ? onClick() : () => {};
							}}>
							{loading ? (
								<Spinner
									spinnerClassName={styles.spinnerBlocks}
								/>
							) : (
								<>
									{icon && (
										<div className={styles.icon}>
											{icon}
										</div>
									)}
									<p className={styles.title}>
										Confirm {title}
									</p>
								</>
							)}
						</button>
					</div>
				) : (
					<button
						type="button"
						className={`${classes} ${styles.submit} `}
						disabled={disabled}
						onClick={() => setConfirm(true)}>
						{loading ? (
							<Spinner spinnerClassName={styles.spinnerBlocks} />
						) : (
							<>
								{icon && (
									<div className={styles.icon}>{icon}</div>
								)}
								<p className={styles.title}>{title}</p>
							</>
						)}
					</button>
				)}
			</>
		);
	}

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
