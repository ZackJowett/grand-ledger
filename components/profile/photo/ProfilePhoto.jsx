import styles from "./ProfilePhoto.module.scss";
import Card from "components/card/Card";
import Avatar from "components/avatar/Avatar";

export default function ProfilePhoto({ className, url }) {
	return (
		<Card
			className={`${className ? className : ""} ${styles.wrapper}`}
			dark>
			<Avatar url={url} />
		</Card>
	);
}
