import Link from "next/link";
import { FaHandshake, FaHandHolding } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { TiArrowForward } from "react-icons/ti";
import { MdSpaceDashboard, MdGroups, MdSettings } from "react-icons/md";
import { BsPersonFill } from "react-icons/bs";
import { FiPlusSquare } from "react-icons/fi";
import styles from "./DesktopNav.module.scss";
// import Logo from "../../logo/Logo";
// import SocialsList from "@/components/icons/socialsList";

export default function HamburgerMenu({ currentRoute, className }) {
	return (
		<>
			<nav className={`${styles.wrapper} ${className ? className : ""}`}>
				{/* <Logo className={styles.logo} /> */}

				<div className={styles.linksWrapper}>
					<Link
						href="/"
						className={`${styles.link} ${
							currentRoute === "/" ? styles.current : ""
						}`}>
						{currentRoute === "/" ? (
							<MdSpaceDashboard className={styles.iconCurrent} />
						) : (
							<MdSpaceDashboard className={styles.icon} />
						)}
						<h2>Dashboard</h2>
					</Link>

					{/* <hr className={styles.hr} /> */}

					<Link
						href="/debts/create"
						className={`${styles.link} ${styles.createDebt} ${
							currentRoute === "/debts/create"
								? styles.current
								: ""
						}`}>
						{currentRoute === "/debts/create" ? (
							<FiPlusSquare className={styles.iconCurrent} />
						) : (
							<FiPlusSquare className={styles.icon} />
						)}
						<h2>Create Debt</h2>
					</Link>

					<Link
						href="/settlements/create"
						className={`${styles.link} ${styles.createSettlement} ${
							currentRoute === "/settlements/create"
								? styles.current
								: ""
						}`}>
						{currentRoute === "/settlements/create" ? (
							<TiArrowForward className={styles.iconCurrent} />
						) : (
							<TiArrowForward className={styles.icon} />
						)}
						<h2>Pay Someone</h2>
					</Link>

					<hr className={styles.hr} />

					<Link
						href="/debts"
						className={`${styles.link} ${
							currentRoute === "/debts" ? styles.current : ""
						}`}>
						{currentRoute === "/debts" ? (
							<IoWarning
								className={`${styles.iconCurrent} ${styles.debts}`}
							/>
						) : (
							<IoWarning
								className={`${styles.icon} ${styles.debts}`}
							/>
						)}
						<h2 className={styles.debts}>Debts</h2>
					</Link>

					<Link
						href="/unreceived-payments"
						className={`${styles.link} ${
							currentRoute === "/unreceived-payments"
								? styles.current
								: ""
						}`}>
						{currentRoute === "/unreceived-payments" ? (
							<FaHandHolding
								className={`${styles.iconCurrent} ${styles.unreceived}`}
							/>
						) : (
							<FaHandHolding
								className={`${styles.icon} ${styles.unreceived}`}
							/>
						)}
						<h2 className={styles.unreceived}>Unreceived</h2>
					</Link>

					<Link
						href="/settlements"
						className={`${styles.link} ${
							currentRoute === "/settlements"
								? styles.current
								: ""
						}`}>
						{currentRoute === "/settlements" ? (
							<FaHandshake
								className={`${styles.iconCurrent} ${styles.settlements}`}
							/>
						) : (
							<FaHandshake
								className={`${styles.icon} ${styles.settlements}`}
							/>
						)}
						<h2 className={styles.settlements}>Settlements</h2>
					</Link>

					<hr className={styles.hr} />
					<div className={styles.bottomIcons}>
						<Link
							href="/profile"
							className={`${styles.navIcon} ${
								currentRoute === "/profile"
									? styles.current
									: ""
							}`}>
							{currentRoute === "/profile" ? (
								<BsPersonFill />
							) : (
								<BsPersonFill />
							)}
							{/* <h5>Profile</h5> */}
						</Link>
						<Link
							href="/groups"
							className={`${styles.navIcon} ${
								currentRoute === "/groups" ? styles.current : ""
							}`}>
							{currentRoute === "/groups" ? (
								<MdGroups />
							) : (
								<MdGroups />
							)}
							{/* <h5>Groups</h5> */}
						</Link>
						<Link
							href="/settings"
							className={`${styles.navIcon} ${
								currentRoute === "/settings"
									? styles.current
									: ""
							}`}>
							{currentRoute === "/settings" ? (
								<MdSettings />
							) : (
								<MdSettings />
							)}
							{/* <h5>Settings</h5> */}
						</Link>
					</div>

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
