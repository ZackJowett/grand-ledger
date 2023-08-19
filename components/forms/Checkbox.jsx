import CustomCheckbox from "react-custom-checkbox";
import styles from "./Checkbox.module.scss";
import { MdCheck } from "react-icons/md";

export default function Checkbox({
	checked = false,
	icon,
	label = "Label",
	className,
	onChange,
	invalid = false,
}) {
	return (
		<div
			className={`${styles.wrapper} ${className ? className : ""} ${
				invalid ? styles.invalid : ""
			}`}>
			<CustomCheckbox
				checked={checked}
				icon={icon ? icon : <MdCheck className={styles.svg} />}
				className={styles.checkbox}
				labelClassName={styles.label}
				containerClassName={styles.container}
				label={label}
				borderRadius={3}
				borderWidth={1}
				onChange={(checked, event) => onChange(checked, event)}
				borderColor="transparent"
			/>
		</div>
	);
}
