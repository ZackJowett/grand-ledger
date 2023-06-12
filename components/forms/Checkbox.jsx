import CustomCheckbox from "react-custom-checkbox";
import styles from "./Checkbox.module.scss";
import { MdCheck } from "react-icons/md";

export default function Checkbox({
	checked = false,
	icon,
	label = "Label",
	className,
	onChange,
}) {
	return (
		<div className={`${styles.wrapper} ${className ? className : ""}`}>
			<CustomCheckbox
				checked={checked}
				icon={icon ? icon : <MdCheck />}
				className={styles.checkbox}
				label={label}
				borderRadius={5}
				borderWidth={1}
				onChange={(checked, event) => onChange(checked, event)}
				borderColor="#e0e0e0"
			/>
		</div>
	);
}
