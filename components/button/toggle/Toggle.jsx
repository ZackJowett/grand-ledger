import styles from "./Toggle.module.scss";
import { MdCheck, MdClose } from "react-icons/md";

export default function Toggle({ title, active = false, onClick, className }) {
	return (
		<div
			className={`${styles.wrapper} ${active ? styles.active : ""} ${
				className ? className : ""
			}`}
			onClick={onClick}>
			<div className={styles.icon}>
				{active ? <MdCheck /> : <MdClose />}
			</div>
			<h6 className={styles.title}>{title}</h6>
		</div>
	);
}
