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
// "settlement-reopen",
// "settlement-resubmit"
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
			return (
				<>
					<span>{name}</span> created a{" "}
					<span className={styles.debt}>Debt</span>
				</>
			);
		} else if (type === "settlement-create") {
			return (
				<>
					<span>{name}</span> created a{" "}
					<span className={styles.settlement}>Settlement</span>
				</>
			);
		} else if (type === "settlement-create-nudge") {
			return (
				<>
					<span>{name}</span> wants you to create a{" "}
					<span className={styles.settlement}>Settlement</span>
				</>
			);
		} else if (type === "settlement-approve-nudge") {
			return (
				<>
					<span>{name}</span> wants you to review a{" "}
					<span className={styles.settlement}>Settlement</span>
				</>
			);
		} else if (type === "settlement-reopen") {
			return (
				<>
					<span>{name}</span> rejected a{" "}
					<span className={styles.settlement}>Settlement</span>
				</>
			);
		} else if (type === "settlement-resubmit") {
			return (
				<>
					<span>{name}</span> resubmitted a{" "}
					<span className={styles.settlement}>Settlement</span>
				</>
			);
		} else if (type === "settlement-approve") {
			return (
				<>
					<span>{name}</span> approved a{" "}
					<span className={styles.settlement}>Settlement</span>
				</>
			);
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
				title={<p className={styles.text}>{getMessage()}</p>}
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
	if (
		type === "debt-create" ||
		type === "settlement-create" ||
		type === "settlement-approve"
	) {
		return <IconButton icon={<MdOutlineRemoveRedEye />} href={link} />;
	} else if (type === "settlement-create-nudge") {
		return (
			<IconButton
				icon={<TiArrowForward />}
				href={"/settlements/create"}
			/>
		);
	} else if (
		type === "settlement-approve-nudge" ||
		type === "settlement-reopen" ||
		type === "settlement-resubmit"
	) {
		return <IconButton icon={<MdSearch />} href={link} />;
	} else {
		return;
	}
}
