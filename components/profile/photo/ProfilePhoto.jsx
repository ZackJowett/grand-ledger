import { BsPersonFill } from "react-icons/bs";
import styles from "./ProfilePhoto.module.scss";
import Card from "components/card/Card";

export default function ProfilePhoto({ className }) {
	return (
		<Card
			className={`${className ? className : ""} ${styles.wrapper}`}
			dark>
			<BsPersonFill />
		</Card>
	);
}
