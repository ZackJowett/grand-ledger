import styles from "./SelectGroup.module.scss";
import { useSession } from "next-auth/react";
import Select from "components/forms/Select";
import { useGroupsWithUser, useSelectedGroup } from "/utils/hooks";
import { setSelectedGroup } from "/utils/data/users";
import { toastPromise } from "/utils/toasts";
import { useSWRConfig } from "swr";

export default function SelectGroup({
	onSelect = () => {
		return;
	},
	className,
}) {
	const { data: session } = useSession();
	const { mutate } = useSWRConfig();
	const {
		data: groups,
		isLoading: groupsLoading,
		isError: groupsError,
	} = useGroupsWithUser(session.user.id);
	const {
		data: selectedGroup,
		isLoading: selectedGroupLoading,
		mutate: mutateSelectedGroup,
	} = useSelectedGroup(session.user.id);

	async function handleChangeGroup(selectedOption) {
		if (selectedGroup && selectedGroup._id == selectedOption.value) return;

		await toastPromise(
			setSelectedGroup(session.user.id, selectedOption.value),
			false,
			{
				loading: "Changing group...",
				success: `Successfully changed to ${selectedOption.label}`,
				error: "Failed to change group",
			}
		);

		// Revalidate all
		mutate(() => true, undefined, { revalidate: true });
		onSelect();
	}

	let options = [];

	if (!groupsLoading && !groupsError && groups) {
		// Create options
		options = groups.map((group) => {
			return {
				value: group._id,
				label: group.name,
			};
		});
	}

	if (selectedGroupLoading) return "Loading...";

	return (
		<Select
			options={options}
			className={`${styles.select} ${className}`}
			defaultValue={
				selectedGroup
					? options.find((entry) => entry.value == selectedGroup._id)
					: null
			}
			onChange={handleChangeGroup}
		/>
	);
}
