import styles from "./SelectUser.module.scss";
import { useState, useEffect, useRef } from "react";
import Button from "components/button/Button";
import { useSession } from "next-auth/react";

export default function SelectUser({
	user,
	userSelected,
	handleSelectUser,
	editingUser,
	setEditingUser,
	recalculateTotal,
}) {
	const { data: session } = useSession();

	// References
	const inputRef = useRef(null);
	const [amount, setAmount] = useState(null);

	useEffect(() => {
		if (!userSelected) return;
		setAmount(Number(userSelected.amount));
	}, [userSelected]);

	useEffect(() => {
		// if editingUser is not this user
		if (editingUser !== user._id) {
			// reset amount
			if (userSelected) {
				setAmount(Number(userSelected.amount));
			}
		}
	}, [editingUser]);

	function handleEdit() {
		if (editingUser === user._id) return;
		setEditingUser(user._id);
		inputRef.current.disabled = false;
		inputRef.current.focus();
	}

	function handleSave() {
		inputRef.current.disabled = true;
		setEditingUser(null);
		userSelected.amount = Number(amount.toFixed(2));
		recalculateTotal();
	}

	return (
		<>
			<div className={styles.wrapper}>
				<div className={styles.checkbox}>
					<input
						type="checkbox"
						id={`checkbox-${user._id}`}
						name={`checkbox-${user._id}`}
						value={user._id}
						onChange={(e) => handleSelectUser(e)}
					/>
					<label htmlFor={`checkbox-${user._id}`}>
						{user._id == session.user.id
							? "Include Myself"
							: user.name}
					</label>
				</div>
				{userSelected && (
					<div
						className={`${styles.amount} ${
							editingUser !== user._id ? styles.disabled : ""
						}`}
						onClick={handleEdit}>
						$
						<input
							type="number"
							name="amount"
							id="amount"
							min="0"
							step="1"
							placeholder="0.00"
							ref={inputRef}
							value={amount ? amount : ""}
							disabled={editingUser !== user._id}
							onChange={(e) => setAmount(Number(e.target.value))}
						/>
						{editingUser === user._id && (
							<Button
								title="Save"
								onClick={handleSave}
								className={styles.saveButton}
							/>
						)}
					</div>
				)}
			</div>
			{user._id == session.user.id && <hr className={styles.hr} />}
		</>
	);
}
