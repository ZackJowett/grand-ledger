import ReactSelect from "react-select";
import styles from "./Select.module.scss";

export default function Select({ options, name, className, onChange }) {
	return (
		<ReactSelect
			options={options}
			name={name}
			onChange={onChange}
			className={`${styles.select} ${className ? className : ""}`}
			styles={{
				container: (baseStyles, state) => ({
					...baseStyles,
					color: "#f5f5f5",
					"&:hover": {},
				}),
				control: (baseStyles, state) => ({
					...baseStyles,
					backgroundColor: "#2581b3",
					border: state.isFocused ? "none" : "none",
					borderRadius: "100px",
					color: "#f5f5f5",
					"&:hover": {},
				}),
				dropdownIndicator: (baseStyles, state) => ({
					...baseStyles,
					color: "#f5f5f5",
					"&:hover": { color: "#2a2a2a" },
				}),

				menu: (baseStyles, state) => ({
					...baseStyles,
					backgroundColor: "#2a2a2a",
					borderRadius: "15px",
					overflow: "hidden",
				}),
				option: (baseStyles, state) => ({
					...baseStyles,
					backgroundColor: "transparent",
					"&:hover": { backgroundColor: "#2581b3" },
				}),
				placeholder: (baseStyles, state) => ({
					...baseStyles,
					color: "#f5f5f5",
					marginLeft: "5px",
				}),
				singleValue: (baseStyles, state) => ({
					...baseStyles,
					color: "#f5f5f5",
					marginLeft: "5px",
				}),
				input: (baseStyles, state) => ({
					...baseStyles,
					color: "#f5f5f5",
					marginLeft: "5px",
				}),
			}}
		/>
	);
}
