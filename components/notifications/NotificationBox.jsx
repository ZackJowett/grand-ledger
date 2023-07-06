import { useState, useEffect, useRef } from "react";
import styles from "./NotificationBox.module.scss";
import {
	getNotifications,
	createNotification,
	deleteNotification,
} from "utils/data/notification";
import { useSession } from "next-auth/react";
import Notification from "./Notification";
import {
	MdNotifications,
	MdNotificationsNone,
	MdNotificationsOff,
} from "react-icons/md";
import Spinner from "components/placeholders/spinner/Spinner";

export default function NotificationBox() {
	const { data: session, status: sessionStatus } = useSession();
	const [loading, setLoading] = useState(true);
	const [notifications, setNotifications] = useState(null);
	const [show, setShow] = useState(false);

	// Reference for click outside hook
	const wrapperRef = useRef(null);
	const bellRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && bellRef.current) {
				if (
					!wrapperRef.current.contains(event.target) &&
					!bellRef.current.contains(event.target)
				) {
					// Close notification box
					setShow(false);
				}
			}
		}
		// Bind the event listener
		document.addEventListener("mouseup", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mouseup", handleClickOutside);
		};
	}, [wrapperRef]);

	// Get notifications on mount
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;

		// Get notifications
		getNotifications(session.user.id).then((data) => {
			if (data === null) return;
			setNotifications(data);
			setLoading(false);
		});
	}, []);

	// Delete notification
	function onDelete(id) {
		setNotifications(
			notifications.filter((notification) => notification._id !== id)
		);

		// Delete notification from database
		deleteNotification(id);
	}
	// Create new notifications

	// User not logged in
	if (sessionStatus !== "authenticated") return;

	return (
		<>
			<div className={styles.wrapper}>
				{notifications === null && loading === false ? (
					<div ref={bellRef}>
						<MdNotificationsOff
							className={`${styles.bell} ${
								show ? styles.show : ""
							}`}
							onClick={() => setShow(!show)}
						/>
					</div>
				) : loading === true || notifications.length <= 0 ? (
					<div ref={bellRef}>
						<MdNotificationsNone
							className={`${styles.bell} ${
								show ? styles.show : ""
							}`}
							onClick={() => setShow(!show)}
						/>
					</div>
				) : (
					<div ref={bellRef}>
						<MdNotifications
							className={`${styles.bell} ${styles.unread} ${
								show ? styles.show : ""
							}`}
							onClick={() => setShow(!show)}
						/>
					</div>
				)}
				<div
					className={`${styles.notifications} ${
						show ? styles.show : ""
					} ${
						loading ||
						notifications === null ||
						notifications.length <= 0
							? styles.empty
							: ""
					}`}
					ref={wrapperRef}>
					{loading === true ? (
						<Spinner />
					) : notifications === null ? (
						<p>Error fetching notifications</p>
					) : notifications.length <= 0 ? (
						<p className={styles.subtext}>No notifications</p>
					) : (
						notifications.map((notification, index) => {
							return (
								<>
									<Notification
										key={notification._id}
										notification={notification}
										link={getLink(notification)}
										onDelete={onDelete}
									/>

									{/* Add horizontal rule */}
									{notifications.length > 1 &&
										index < notifications.length - 1 && (
											<hr className={styles.hr} />
										)}
								</>
							);
						})
					)}
				</div>
			</div>
		</>
	);
}

function getLink(notification) {
	if (notification.type.includes("debt")) {
		return `/debts/${notification.target}`;
	} else if (notification.type.includes("settlement")) {
		return `/settlements/${notification.target}`;
	} else {
		return "";
	}
}
