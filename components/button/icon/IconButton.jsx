import Link from "next/link";
import styles from "./IconButton.module.scss";
import Spinner from "components/placeholders/spinner/Spinner";

export default function Button({
	className,
	href,
	dark,
	onClick = null,
	icon,
	loading = false,
}) {
	let classes = "";
	classes += className ? className : "";
	classes += dark ? " " + styles.dark : "";
	classes += " " + styles.wrapper;

	return (
		<>
			{href ? (
				<Link href={href} className={classes}>
					{loading ? (
						<Spinner spinnerClassName={styles.spinnerBlocks} />
					) : (
						<>{icon}</>
					)}
				</Link>
			) : (
				<div
					className={classes}
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
						<>{icon}</>
					)}
				</div>
			)}
		</>
	);
}
