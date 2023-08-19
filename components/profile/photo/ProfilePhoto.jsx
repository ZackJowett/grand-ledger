import styles from "./ProfilePhoto.module.scss";
import Card from "components/card/Card";
import Avatar from "components/avatar/Avatar";
import { MdPerson } from "react-icons/md";

export default function ProfilePhoto({ className, url }) {
	return (
		<Card
			className={`${className ? className : ""} ${styles.wrapper}`}
			dark>
			{url ? <Avatar url={url} /> : <MdPerson />}
		</Card>
	);
}
