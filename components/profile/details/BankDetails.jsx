import Card from "components/card/Card";
import { useSession } from "next-auth/react";
import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./BankDetails.module.scss";
import { useEffect, useState } from "react";
import Button from "components/button/Button";
import { InputNumber } from "components/forms/Input";
import { setBankDetails } from "utils/data/users";
import Spinner from "components/placeholders/spinner/Spinner";
import { useRouter } from "next/router";

export default function BankDetails({ className, user }) {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [updateDetails, setUpdateDetails] = useState(false);
	const [bsb, setBsb] = useState(user.bsb);
	const [accountNumber, setAccountNumber] = useState(user.accountNumber);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	// Save details to database
	function saveDetails() {
		setLoading(true);
		setUpdateDetails(false);

		// Save details to database
		setBankDetails(user._id, bsb, accountNumber).then((res) => {
			if (!res.success) {
				// If error, show error message
				setError(res.message);
				setSuccess(false);
				setUpdateDetails(true);
				setLoading(false);
			} else {
				// If success, update user details
				setError(null);
				setUpdateDetails(false);
				setLoading(false);
				router.reload();

				// Show success for 3 seconds
				setSuccess(true);
				setTimeout(() => {
					setSuccess(false);
				}, 3000);
			}
		});
	}

	return (
		<Card
			title="Bank Details"
			subtitle={!loading && "Click to copy"}
			dark
			className={`${className ? className : ""} ${styles.card}`}>
			{loading ? (
				<Spinner title="Saving details..." />
			) : (
				<>
					<div className={styles.wrapper}>
						<AccountDetail title="BSB" value={user.bsb} />
						<AccountDetail
							title="Account Number"
							value={user.accountNumber}
						/>
					</div>

					{/* If user is logged in, show option to edit bsb and account number */}
					{status === "authenticated" &&
					session.user.id === user._id ? (
						<div className={styles.formWrapper}>
							{updateDetails ? (
								<div className={styles.form}>
									<InputNumber
										placeholder="New BSB"
										name="acc"
										className={styles.input}
										onChange={(e) => setBsb(e.target.value)}
									/>
									<InputNumber
										placeholder="New Account Number"
										name="acc"
										className={styles.input}
										onChange={(e) =>
											setAccountNumber(e.target.value)
										}
									/>
									<Button
										title="Save"
										className={styles.saveButton}
										onClick={saveDetails}
									/>
								</div>
							) : (
								<Button
									title="Update Details"
									className={styles.editButton}
									onClick={() =>
										setUpdateDetails(!updateDetails)
									}
								/>
							)}
						</div>
					) : (
						<p className={styles.notice}>
							More payment methods coming soon
						</p>
					)}
					{error && <p className={styles.error}>{error}</p>}
					{success && (
						<p className={styles.success}>
							Successfully updated details.
						</p>
					)}
				</>
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
