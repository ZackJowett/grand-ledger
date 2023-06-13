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
		<div className={styles.wrapperText}>
			{title && (
				<TextWithTitle
					className={styles.title}
					title={title}
					tiny={large ? false : true}
				/>
			)}
			<input
				className={`${styles.inputText} ${className ? className : ""} ${
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

export function InputNumber({
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
	step,
	min,
}) {
	return (
		<div className={styles.wrapperNumber}>
			{title && (
				<TextWithTitle
					className={styles.title}
					title={title}
					tiny={large ? false : true}
				/>
			)}
			<input
				className={`${styles.inputNumber} ${
					className ? className : ""
				} ${dark ? styles.dark : ""} ${
					disabled ? styles.disabled : ""
				}`}
				type="number"
				name={name}
				id={name}
				inputmode="decimal"
				step={step}
				min={min}
				placeholder={placeholder}
				value={value ? value : null}
				onChange={onChange}
				required={required}
				disabled={disabled}
			/>
		</div>
	);
}
