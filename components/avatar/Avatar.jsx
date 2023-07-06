import { BsPersonFill } from "react-icons/bs";
import styles from "./Avatar.module.scss";
import { CldImage } from "next-cloudinary";

export default function Avatar({ url, className, size = 100 }) {
	if (!url) {
		<BsPersonFill className={styles.icon} />;
	}

	return (
		<div className={styles.wrapper}>
			<CldImage width="500" height="500" src={url} />
		</div>
	);
}
