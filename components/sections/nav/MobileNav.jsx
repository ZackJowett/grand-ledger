import Link from "next/link";
import { useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { FaHandshake, FaHandHolding } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { TiArrowForward } from "react-icons/ti";
import { MdSpaceDashboard, MdGroups, MdSettings } from "react-icons/md";
import styles from "./MobileNav.module.scss";
// import Logo from "../../logo/Logo";
// import SocialsList from "@/components/icons/socialsList";

export default function HamburgerMenu({ currentRoute }) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<RxHamburgerMenu
				className={styles.hamburgerButton}
				size={30}
				onClick={toggleMenu}
			/>
			<div
				className={`${styles.navWrapper} ${isOpen ? styles.open : ""}`}>
				<RxCross2
					className={styles.exitCross}
					size={40}
					onClick={toggleMenu}
				/>
				<nav className={styles.nav}>
					{/* <Logo className={styles.logo} /> */}
					<div className={styles.navLinkContainer}>
						<Link
							href="/"
							className={`${styles.navItem} ${
								currentRoute === "/" ? styles.current : ""
							}`}>
							{currentRoute === "/" ? (
								<MdSpaceDashboard
									className={styles.navItemIconCurrent}
								/>
							) : (
								<MdSpaceDashboard
									className={styles.navItemIcon}
								/>
							)}
							<h2>Dashboard</h2>
						</Link>
						{/* <RoundedBar length="90%" margin="2rem" /> */}
						<Link
							href="/settlements/create"
							className={`${styles.navItem} ${styles.highlight} ${
								currentRoute === "/settlements/create"
									? styles.current
									: ""
							}`}>
							{currentRoute === "/settlements/create" ? (
								<TiArrowForward
									className={styles.navItemIconCurrent}
								/>
							) : (
								<TiArrowForward
									className={styles.navItemIcon}
								/>
							)}
							<h2>Make Payment</h2>
						</Link>
						<Link
							href="/debts"
							className={`${styles.navItem} ${
								currentRoute === "/debts" ? styles.current : ""
							}`}>
							{currentRoute === "/debts" ? (
								<IoWarning
									className={styles.navItemIconCurrent}
								/>
							) : (
								<IoWarning className={styles.navItemIcon} />
							)}
							<h2>Outstanding Debts</h2>
						</Link>
						<Link
							href="/unreceived-payments"
							className={`${styles.navItem} ${
								currentRoute === "/unreceived-payments"
									? styles.current
									: ""
							}`}>
							{currentRoute === "/unreceived-payments" ? (
								<FaHandHolding
									className={styles.navItemIconCurrent}
								/>
							) : (
								<FaHandHolding className={styles.navItemIcon} />
							)}
							<h2>Unreceived Payments</h2>
						</Link>
						<Link
							href="/settlements"
							className={`${styles.navItem} ${
								currentRoute === "/settlements"
									? styles.current
									: ""
							}`}>
							{currentRoute === "/settlements" ? (
								<FaHandshake
									className={styles.navItemIconCurrent}
								/>
							) : (
								<FaHandshake className={styles.navItemIcon} />
							)}
							<h2>Settlements</h2>
						</Link>
						<div className={styles.bottomIcons}>
							<Link
								href="/profile"
								className={`${styles.navIcon} ${
									currentRoute === "/profile"
										? styles.current
										: ""
								}`}>
								{currentRoute === "/profile" ? (
									<svg
										width="53"
										height="53"
										viewBox="0 0 53 53"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M46.6667 46.6667H5.83333V5.83333H46.6667M46.6667 0H5.83333C4.28624 0 2.80251 0.614581 1.70854 1.70854C0.614581 2.80251 0 4.28624 0 5.83333V46.6667C0 48.2138 0.614581 49.6975 1.70854 50.7915C2.80251 51.8854 4.28624 52.5 5.83333 52.5H46.6667C48.2138 52.5 49.6975 51.8854 50.7915 50.7915C51.8854 49.6975 52.5 48.2138 52.5 46.6667V5.83333C52.5 2.59583 49.875 0 46.6667 0ZM39.375 38.6458C39.375 34.2708 30.625 32.0833 26.25 32.0833C21.875 32.0833 13.125 34.2708 13.125 38.6458V40.8333H39.375M26.25 26.9792C27.9905 26.9792 29.6597 26.2878 30.8904 25.0571C32.1211 23.8263 32.8125 22.1572 32.8125 20.4167C32.8125 18.6762 32.1211 17.007 30.8904 15.7763C29.6597 14.5456 27.9905 13.8542 26.25 13.8542C24.5095 13.8542 22.8403 14.5456 21.6096 15.7763C20.3789 17.007 19.6875 18.6762 19.6875 20.4167C19.6875 22.1572 20.3789 23.8263 21.6096 25.0571C22.8403 26.2878 24.5095 26.9792 26.25 26.9792Z"
											fill="white"
										/>
									</svg>
								) : (
									<svg
										width="53"
										height="53"
										viewBox="0 0 53 53"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M46.6667 46.6667H5.83333V5.83333H46.6667M46.6667 0H5.83333C4.28624 0 2.80251 0.614581 1.70854 1.70854C0.614581 2.80251 0 4.28624 0 5.83333V46.6667C0 48.2138 0.614581 49.6975 1.70854 50.7915C2.80251 51.8854 4.28624 52.5 5.83333 52.5H46.6667C48.2138 52.5 49.6975 51.8854 50.7915 50.7915C51.8854 49.6975 52.5 48.2138 52.5 46.6667V5.83333C52.5 2.59583 49.875 0 46.6667 0ZM39.375 38.6458C39.375 34.2708 30.625 32.0833 26.25 32.0833C21.875 32.0833 13.125 34.2708 13.125 38.6458V40.8333H39.375M26.25 26.9792C27.9905 26.9792 29.6597 26.2878 30.8904 25.0571C32.1211 23.8263 32.8125 22.1572 32.8125 20.4167C32.8125 18.6762 32.1211 17.007 30.8904 15.7763C29.6597 14.5456 27.9905 13.8542 26.25 13.8542C24.5095 13.8542 22.8403 14.5456 21.6096 15.7763C20.3789 17.007 19.6875 18.6762 19.6875 20.4167C19.6875 22.1572 20.3789 23.8263 21.6096 25.0571C22.8403 26.2878 24.5095 26.9792 26.25 26.9792Z"
											fill="white"
										/>
									</svg>
								)}
								{/* <h5>Profile</h5> */}
							</Link>
							<Link
								href="/groups"
								className={`${styles.navIcon} ${
									currentRoute === "/groups"
										? styles.current
										: ""
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
					</div>
				</nav>
			</div>
			<div
				className={`${styles.navCloseOutside} ${
					isOpen ? styles.open : ""
				}`}
				onClick={toggleMenu}
			/>
		</>
	);
}
