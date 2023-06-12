import Link from "next/link";
import { useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { FaHandshake, FaHandHolding } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { TiArrowForward } from "react-icons/ti";
import { MdSpaceDashboard, MdGroups, MdSettings } from "react-icons/md";
import Image from "next/image";
import DesktopNav from "./DesktopNav";
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
				<Image
					src="/images/logo.png"
					width={500}
					height={500}
					className={styles.logo}
				/>
				<DesktopNav currentRoute={currentRoute} />
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
