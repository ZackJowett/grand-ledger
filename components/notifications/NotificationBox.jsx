import { useState, useEffect } from "react";
import styles from "./NotificationBox.module.scss";
import { getNotifications, createNotification } from "utils/data/notification";
import { useSession } from "next-auth/react";
import Notification from "./Notification";

export default function NotificationBox() {
	const { data: session, status: sessionStatus } = useSession();
	const [notifications, setNotifications] = useState(null);

	// Get notifications on mount
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;

		// Get notifications
		getNotifications(session.user.id).then((data) => {
			console.log(data);
			if (data === null) return;
			setNotifications(data);
		});
	}, []);

	// Create new notifications

	// User not logged in
	if (sessionStatus !== "authenticated") return;

	// No notifications
	if (notifications === null) {
		return (
			<div className={styles.wrapper}>Error fetching notifications.</div>
		);
	} else if (notifications.length <= 0) {
		return <div className={styles.wrapper}>No Notifications</div>;
	}

	return (
		<div className={styles.wrapper}>
			{notifications.map((notification) => {
				return <Notification notification={notification} />;
			})}
		</div>
	);
}
