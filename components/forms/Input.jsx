import TextWithTitle from "components/text/title/TextWithTitle";
import styles from "./Input.module.scss";

// Input text
export function InputText({
	placeholder = "",
	value,
	onChange = () => {},
	name,
	required = false,
	disabled = false,
	className,
	wrapperClassName,
	large,
	title,
	dark,
}) {
	const maxLength = 100;

	return (
		<div
			className={`${styles.wrapperText} ${
				wrapperClassName ? wrapperClassName : ""
			}`}>
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
				value={value}
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
	value,
	onChange = () => {},
	name = "",
	required = false,
	disabled = false,
	className = null,
	large = false,
	title = "",
	dark = false,
	step = 1,
	min = 0,
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
				value={value}
				onChange={onChange}
				required={required}
				disabled={disabled}
			/>
		</div>
	);
}

// Input text
export function InputPassword({
	placeholder = "",
	value,
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
				type="password"
				name={name}
				id={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
				disabled={disabled}
				maxLength={maxLength}
			/>
		</div>
	);
}

// Input text
export function InputEmail({
	placeholder = "",
	value,
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
				type="email"
				name={name}
				id={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
				disabled={disabled}
				maxLength={maxLength}
			/>
		</div>
	);
}
