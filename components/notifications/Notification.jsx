// Possible notification types:
// "debt-create",
// "debt-update",
// "debt-delete",
// "debt-remind",
// "settlement-create",
// "settlement-update",
// "settlement-delete",
// "settlement-remind",
// "settlement-approve",
// "settlement-reject",
// "settlement-create-nudge",
// "settlement-approve-nudge",

import { formatDate } from "utils/helpers";
import styles from "./Notification.module.scss";
import TextWithTitle from "components/text/title/TextWithTitle";
import { useState, useEffect, useRef } from "react";
import { getAllUsers } from "utils/data/users";
import { useSession } from "next-auth/react";
import IconButton from "components/button/icon/IconButton";
import { MdClose, MdOutlineRemoveRedEye, MdSearch } from "react-icons/md";
import { TiArrowForward } from "react-icons/ti";

import { NotificationPlaceholder } from "../placeholders/Placeholders";
import { useRouter } from "next/router";

export default function Notification({ notification, link = "", onDelete }) {
	const { data: session, status: sessionStatus } = useSession();
	const router = useRouter();

	const [users, setUsers] = useState([]);
	const [showButtons, setShowButtons] = useState(false);
	// const [loading, setLoading] = useState(true);

	// Get All users
	useEffect(() => {
		if (sessionStatus !== "authenticated") return;
		getAllUsers().then((res) => {
			setUsers(res);
		});
	}, [sessionStatus]);

	// Get hover
	const hoverRef = useRef(null);
	useEffect(() => {
		function handleClickOutside(event) {
			if (hoverRef.current && !hoverRef.current.contains(event.target)) {
				// Close notification box
				setShowButtons(false);
			} else {
				setShowButtons(true);
			}
		}
		// Bind the event listener
		document.addEventListener("mouseover", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mouseover", handleClickOutside);
		};
	}, [hoverRef]);

	function getMessage() {
		const type = notification.type;
		const name = getName(notification.creator);

		if (type === "debt-create") {
			return name + " has created a debt with you";
		} else if (type === "settlement-create-nudge") {
			return name + " nudged you to create a settlement with them";
		} else if (type === "settlement-approve-nudge") {
			return name + " nudged you to review a settlement with them";
		} else {
			return <p>Unknown notification type. Contact Admin.</p>;
		}
	}

	function getName(id) {
		if (!users) return "Someone";
		const user = users.find((user) => user._id === id);
		if (!user) return "Someone";
		return user.name;
	}

	// if (loading) {
	// 	return <NotificationPlaceholder />;
	// }

	return (
		<div className={styles.wrapper} ref={hoverRef}>
			<TextWithTitle
				title={<p>{getMessage()}</p>}
				text={formatDate(notification.dateCreated)}
				align="left"
			/>

			<div
				className={`${styles.buttons} ${
					showButtons ? styles.show : ""
				}`}>
				{getIconLink(notification.type, link)}
				<IconButton
					icon={<MdClose />}
					onClick={() => onDelete(notification._id)}
				/>
			</div>
		</div>
	);
}

function getIconLink(type, link) {
	if (type === "debt-create" || type === "settlement-create") {
		return <IconButton icon={<MdOutlineRemoveRedEye />} href={link} />;
	} else if (type === "settlement-create-nudge") {
		return (
			<IconButton
				icon={<TiArrowForward />}
				href={"/settlements/create"}
			/>
		);
	} else if (type === "settlement-approve-nudge") {
		return <IconButton icon={<MdSearch />} href={link} />;
	} else {
		return;
	}
}
