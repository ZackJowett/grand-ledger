import styles from "./Logo.module.scss";
import Image from "next/image";

export default function Logo() {
	return (
		<Image
			src="http://localhost:3000/images/logo.png"
			className={styles.image}
			height={500}
			width={500}
			alt="Logo"
		/>
	);
}
