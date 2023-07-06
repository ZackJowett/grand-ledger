import Link from "next/link";
import { FaHandshake } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { TiArrowForward } from "react-icons/ti";
import {
	MdMoneyOff,
	MdSpaceDashboard,
	MdGroups,
	MdSettings,
} from "react-icons/md";
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
						className={`${styles.link} ${styles.dashboard} ${
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

					<br />

					<Link
						href="/debts"
						className={`${styles.link} ${styles.debts} ${
							currentRoute === "/debts" ? styles.current : ""
						}`}>
						{currentRoute === "/debts" ? (
							<IoWarning className={styles.iconCurrent} />
						) : (
							<IoWarning className={styles.icon} />
						)}
						<h2 className={styles.debts}>Debts</h2>
					</Link>

					<Link
						href="/unreceived-payments"
						className={`${styles.link} ${styles.unreceived} ${
							currentRoute === "/unreceived-payments"
								? styles.current
								: ""
						}`}>
						{currentRoute === "/unreceived-payments" ? (
							<MdMoneyOff className={styles.iconCurrent} />
						) : (
							<MdMoneyOff className={styles.icon} />
						)}
						<h2 className={styles.unreceived}>Unreceived</h2>
					</Link>

					<Link
						href="/settlements"
						className={`${styles.link} ${styles.settlements} ${
							currentRoute === "/settlements"
								? styles.current
								: ""
						}`}>
						{currentRoute === "/settlements" ? (
							<FaHandshake className={styles.iconCurrent} />
						) : (
							<FaHandshake className={styles.icon} />
						)}
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
							}`}>
							{currentRoute === "/profile/[[...user]]" ? (
								<BsPersonFill />
							) : (
								<BsPersonFill />
							)}
						</Link>

						<Link
							href="/groups"
							className={`${styles.bottomIcon} ${
								currentRoute === "/groups" ? styles.current : ""
							}`}>
							{currentRoute === "/groups" ? (
								<MdGroups />
							) : (
								<MdGroups />
							)}
						</Link>

						<Link
							href="/settings"
							className={`${styles.bottomIcon} ${
								currentRoute === "/settings"
									? styles.current
									: ""
							}`}>
							{currentRoute === "/settings" ? (
								<MdSettings />
							) : (
								<MdSettings />
							)}
						</Link>
					</div>
					{/* <hr className={styles.hr} /> */}

					<Link
						href="/updates"
						className={`${styles.link} ${styles.updates} ${
							currentRoute === "/updates" ? styles.current : ""
						}`}>
						<h2 className={styles.updates}>Updates</h2>
					</Link>

					<Link
						href="https://zacharyjowett.dev"
						className={styles.signature}>
						v1.0 by Zack Jowett
					</Link>
				</div>
			</nav>
		</>
	);
}
