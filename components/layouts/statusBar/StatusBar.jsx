import { useRouter } from "next/router";
import { useSelectedGroup } from "utils/hooks";
import { useSession } from "next-auth/react";
import styles from "./StatusBar.module.scss";
import {
	IconGroup,
	IconDebtCreate,
	IconSettlementCreate,
	IconBack,
} from "components/icons";
import Link from "next/link";
import SelectGroup from "components/group/select/SelectGroup";
import Spinner from "components/placeholders/spinner/Spinner";

export default function StatusBar() {
	const router = useRouter();
	const { data: session } = useSession();
	const group = useSelectedGroup(session.user.id);

	// Get the items to include in the status bar
	const includeItems = getStatusBarItems(router);
	if (!includeItems || includeItems.length <= 0) return;

	return (
		<div className={styles.statusBar}>
			<div className={styles.leftArray}>
				{includeItems.includes("back") && (
					<div
						className={styles.button}
						onClick={() => {
							router.back();
						}}>
						<IconBack /> <p>Back</p>
					</div>
				)}

				<SelectGroup className={styles.selectGroup} />

				{includeItems.includes("createDebt") && (
					<Link
						href="/debts/create"
						className={`${styles.button} ${styles.debt}`}>
						<IconDebtCreate /> <p>Create Debt</p>
					</Link>
				)}

				{includeItems.includes("createSettlement") && (
					<Link
						href="/settlements/create"
						className={`${styles.button} ${styles.settlement}`}>
						<IconSettlementCreate /> <p>Create Settlement</p>
					</Link>
				)}
			</div>

			{includeItems.includes("currentGroup") && (
				<>
					{" "}
					{group.isLoading ? (
						<div>
							<Spinner />
						</div>
					) : !group.exists ? (
						<div className={styles.currentGroup}>
							<p>{"No Group"}</p>
						</div>
					) : (
						<Link
							href={`/groups/${group.data._id}`}
							className={styles.currentGroup}>
							<IconGroup />{" "}
							<p>{group.data.name}eshsehsehsehsehseh</p>
						</Link>
					)}
				</>
			)}
		</div>
	);
}

function getStatusBarItems(router) {
	// Include these items in the status bar
	let includeItems = [];

	// Dont include the status bar on these routes
	const dontIncludeInRoutes = ["/login", "/register", "/forgot-password"];
	if (dontIncludeInRoutes.includes(router.pathname)) return;

	// Add items to the status bar
	// Back button
	if (router.pathname !== "/") {
		includeItems.push("back");
	}

	// Current group
	if (true) {
		includeItems.push("currentGroup");
	}

	// Create debt button
	if (router.pathname !== "/debts/create") {
		includeItems.push("createDebt");
	}

	// Create settlement button
	if (router.pathname !== "/settlements/create") {
		includeItems.push("createSettlement");
	}

	return includeItems;
}
