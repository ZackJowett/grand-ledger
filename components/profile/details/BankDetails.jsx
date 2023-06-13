import Card from "components/card/Card";
import { useSession } from "next-auth/react";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./BankDetails.module.scss";
import { useEffect, useState } from "react";
import Button from "components/button/Button";

export default function BankDetails({ user }) {
	const { data: session } = useSession();

	return (
		<Card title="Bank Details" subtitle="Click to copy" dark>
			<div className={styles.wrapper}>
				<AccountDetail title="BSB" value={user.bsb} />
				<AccountDetail
					title="Account Number"
					value={user.accountNumber}
				/>
			</div>
			{/* If user is logged in, show option to edit bsb and account number */}
			{session && session.user.id === user._id && (
				<Button title="Update Details" className={styles.editButton} />
			)}
		</Card>
	);
}

function AccountDetail({ title, value }) {
	const [copied, setCopied] = useState(false);

	function handleCopied(e, text) {
		// Copy to clipboard
		navigator.clipboard.writeText(text);
		setCopied(true);
	}

	useEffect(() => {
		// show user that the text has been copied for 2 seconds
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 1000);
		}
	}, [copied]);

	return (
		<TextWithTitle
			text={copied ? "Copied!" : title}
			title={copied ? null : value}
			tiny
			align="left"
			reverse
			background
			className={styles.detail}
			onClick={(e) => {
				handleCopied(e, value);
			}}
		/>
	);
}
