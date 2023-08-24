import styles from "./SelectGroup.module.scss";
import { useSession } from "next-auth/react";
import Select from "components/forms/Select";
import { useGroupsWithUser, useSelectedGroup } from "/utils/hooks";
import { setSelectedGroup } from "/utils/data/users";
import { getGroup } from "/utils/data/groups";
import { toast } from "react-toastify";

export default function SelectGroup({
	onSelect = () => {
		return;
	},
	className,
}) {
	const { data: session } = useSession();
	const {
		data: groups,
		isLoading: groupsLoading,
		isError: groupsError,
	} = useGroupsWithUser(session.user.id);
	const selectedGroup = useSelectedGroup(session.user.id);

	// Middleware for setting group
	// Sets the selected group, then fetches the group information
	// that was returned by the new user (that now has the new group),
	// then returns the new group
	async function handleSetGroup(user, selectedOption) {
		const newUser = await setSelectedGroup(user, selectedOption);
		if (!newUser.success) throw new Error("Failed to set group");
		const newGroup = await getGroup(newUser.data.selectedGroup);
		if (!newGroup.success) throw new Error("Failed to set group");

		return newGroup.data;
	}

	async function handleChangeGroup(selectedOption) {
		if (
			selectedGroup.exists &&
			selectedGroup.data._id == selectedOption.value
		)
			return;

		// Revalidate all
		try {
			const newData = groups.find(
				(group) => group._id == selectedOption.value
			);
			console.log(newData);
			await selectedGroup.mutate(
				handleSetGroup(session.user.id, selectedOption.value),
				{
					optimisticData: newData,
					populateCache: true,
					revalidate: false,
					rollbackOnError: true,
				}
			);
			toast.success("Successfully changed groups");

			console.lo;
			onSelect();
		} catch {
			toast.error("Failed to change groups");
		}
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

	if (!selectedGroup.exists) return;

	return (
		<Select
			options={options}
			className={`${styles.select} ${className}`}
			defaultValue={
				selectedGroup.exists
					? options.find(
							(entry) => entry.value == selectedGroup.data._id
					  )
					: null
			}
			onChange={handleChangeGroup}
		/>
	);
}
