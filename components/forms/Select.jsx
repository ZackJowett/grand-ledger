import ReactSelect from "react-select";
import styles from "./Select.module.scss";

export default function Select({
	options,
	name,
	className,
	onChange,
	defaultValue,
}) {
	return (
		<ReactSelect
			options={options}
			name={name}
			onChange={onChange}
			defaultValue={defaultValue}
			className={`${styles.select} ${className ? className : ""}`}
			styles={{
				container: (baseStyles) => ({
					...baseStyles,
					color: "#f5f5f5",
					"&:hover": {},
				}),
				control: (baseStyles) => ({
					...baseStyles,
					backgroundColor: "#2581b3",
					border: "solid 2px transparent",
					borderRadius: "100px",
					color: "#f5f5f5",
					"&:hover": { borderColor: "#f5f5f5" },
				}),
				dropdownIndicator: (baseStyles) => ({
					...baseStyles,
					color: "#f5f5f5",
					"&:hover": { color: "#2a2a2a" },
				}),

				menu: (baseStyles) => ({
					...baseStyles,
					backgroundColor: "#2a2a2a",
					borderRadius: "15px",
					overflow: "hidden",
				}),
				option: (baseStyles, state) => ({
					...baseStyles,
					backgroundColor: state.isSelected ? "#333" : "transparent",
					"&:hover": { backgroundColor: "#2581b3" },
				}),
				placeholder: (baseStyles) => ({
					...baseStyles,
					color: "#f5f5f5",
					marginLeft: "5px",
				}),
				singleValue: (baseStyles) => ({
					...baseStyles,
					color: "#f5f5f5",
					marginLeft: "5px",
				}),
				input: (baseStyles) => ({
					...baseStyles,
					color: "#f5f5f5",
					marginLeft: "5px",
				}),
			}}
		/>
	);
}
