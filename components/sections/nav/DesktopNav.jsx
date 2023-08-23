import Link from "next/link";
import styles from "./DesktopNav.module.scss";
import {
	IconDashboard,
	IconDebt,
	IconDebtCreate,
	IconUnreceieved,
	IconSettlement,
	IconSettlementCreate,
	IconProfile,
	IconGroup,
	IconSettings,
} from "/components/icons";
import { useSession } from "next-auth/react";
import SelectGroup from "components/group/select/SelectGroup";
import { useSelectedGroup } from "/utils/hooks";

export default function HamburgerMenu({
	currentRoute,
	className,
	toggleMenu = () => {
		return;
	},
}) {
	const { data: session, status: sessionStatus } = useSession();
	const { data: selectedGroup, isLoading: selectedGroupLoading } =
		useSelectedGroup(session.user.id);

	return (
		<>
			<nav className={`${styles.wrapper} ${className ? className : ""}`}>
				{/* <Logo className={styles.logo} /> */}

				<div className={styles.linksWrapper}>
					<SelectGroup />
					{selectedGroupLoading ? (
						"Loading..."
					) : selectedGroup ? (
						<Link
							className={styles.selectedGroup}
							href={`/groups/${selectedGroup._id}`}>
							{selectedGroup.name}
						</Link>
					) : (
						"No Group Found"
					)}
					<Link
						href="/"
						className={`${styles.link} ${styles.dashboard} ${
							currentRoute === "/" ? styles.current : ""
						}`}
						onClick={toggleMenu}>
						<IconDashboard
							className={
								currentRoute === "/"
									? styles.iconCurrent
									: styles.icon
							}
						/>
						<h2>Dashboard</h2>
					</Link>

					<Link
						href="/debts/create"
						className={`${styles.link} ${styles.createDebt} ${
							currentRoute === "/debts/create"
								? styles.current
								: ""
						}`}
						onClick={toggleMenu}>
						<IconDebtCreate
							className={
								currentRoute === "/debts/create"
									? styles.iconCurrent
									: styles.icon
							}
						/>

						<h2>Create Debt</h2>
					</Link>

					<Link
						href="/settlements/create"
						className={`${styles.link} ${styles.createSettlement} ${
							currentRoute === "/settlements/create"
								? styles.current
								: ""
						}`}
						onClick={toggleMenu}>
						<IconSettlementCreate
							className={
								currentRoute === "/settlements/create"
									? styles.iconCurrent
									: styles.icon
							}
						/>
						<h2>Pay Someone</h2>
					</Link>

					<br />

					<Link
						href="/debts"
						className={`${styles.link} ${styles.debts} ${
							currentRoute === "/debts" ? styles.current : ""
						}`}
						onClick={toggleMenu}>
						<IconDebt
							className={
								currentRoute === "/debts"
									? styles.iconCurrent
									: styles.icon
							}
						/>
						<h2 className={styles.debts}>Debts</h2>
					</Link>

					<Link
						href="/unreceived-payments"
						className={`${styles.link} ${styles.unreceived} ${
							currentRoute === "/unreceived-payments"
								? styles.current
								: ""
						}`}
						onClick={toggleMenu}>
						<IconUnreceieved
							className={
								currentRoute === "/unreceived-payments"
									? styles.iconCurrent
									: styles.icon
							}
						/>
						<h2 className={styles.unreceived}>Unreceived</h2>
					</Link>

					<Link
						href="/settlements"
						className={`${styles.link} ${styles.settlements} ${
							currentRoute === "/settlements"
								? styles.current
								: ""
						}`}
						onClick={toggleMenu}>
						<IconSettlement
							className={
								currentRoute === "/settlements"
									? styles.iconCurrent
									: styles.icon
							}
						/>
						<h2 className={styles.settlements}>Settlements</h2>
					</Link>

					<br />
					<div className={styles.bottomIcons}>
						<Link
							href="/profile"
							className={`${styles.bottomIcon} ${
								currentRoute === "/profile/[[...user]]"
									? styles.current
									: ""
							}`}
							onClick={toggleMenu}>
							<IconProfile
								className={
									currentRoute === "/profile/[[...user]]"
										? styles.iconCurrent
										: styles.icon
								}
							/>
						</Link>

						<Link
							href="/groups"
							className={`${styles.bottomIcon} ${styles.groups} ${
								currentRoute === "/groups" ? styles.current : ""
							}`}
							onClick={toggleMenu}>
							<IconGroup
								className={
									currentRoute === "/groups"
										? styles.iconCurrent
										: styles.icon
								}
							/>
						</Link>

						<Link
							href="/settings"
							className={`${styles.bottomIcon} ${
								currentRoute === "/settings"
									? styles.current
									: ""
							}`}
							onClick={toggleMenu}>
							<IconSettings
								className={
									currentRoute === "/settings"
										? styles.iconCurrent
										: styles.icon
								}
							/>
						</Link>
					</div>
					{/* <hr className={styles.hr} /> */}

					<Link
						href="/updates"
						className={`${styles.link} ${styles.updates} ${
							currentRoute === "/updates" ? styles.current : ""
						}`}
						onClick={toggleMenu}>
						<h2 className={styles.updates}>Updates</h2>
					</Link>

					<Link
						href="https://zacharyjowett.dev"
						className={styles.signature}>
						by Zack Jowett
					</Link>
				</div>
			</nav>
		</>
	);
}
