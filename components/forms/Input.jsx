import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./Input.module.scss";

// Input text
export function InputText({
	placeholder = "",
	value = "",
	onChange = () => {},
	name,
	required = false,
	disabled = false,
	className,
	large,
	title,
	dark,
}) {
	const maxLength = 100;

	return (
		<div className={styles.wrapper}>
			{title && (
				<TextWithTitle
					className={styles.title}
					title={title}
					tiny={large ? false : true}
				/>
			)}
			<input
				className={`${styles.input} ${className ? className : ""} ${
					dark ? styles.dark : ""
				} ${disabled ? styles.disabled : ""}`}
				type="text"
				name={name}
				id={name}
				placeholder={placeholder}
				value={value ? value : null}
				onChange={onChange}
				required={required}
				disabled={disabled}
				maxLength={maxLength}
			/>
		</div>
	);
}
