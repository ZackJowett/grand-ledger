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

export default function Notification({ notification }) {
	return (
		<div>
			<Message type={notification.type} />
			<p>{formatDate(notification.dateCreated)}</p>
		</div>
	);
}

function Message({ type }) {
	if (type === "debt-create") {
		return <p>Someone has created a debt with you.</p>;
	} else {
		return <p>Unknown notification type. Contact Admin.</p>;
	}
}
