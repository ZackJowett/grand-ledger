import { useState, useRef, useEffect } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import DesktopNav from "./DesktopNav";
import styles from "./MobileNav.module.scss";
import Logo from "components/logo/Logo";
import Link from "next/link";

export default function HamburgerMenu({ currentRoute }) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	// Reference for click outside hook
	const wrapperRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target)
			) {
				// Close notification box
				setIsOpen(false);
			}
		}
		// Bind the event listener
		document.addEventListener("mouseup", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mouseup", handleClickOutside);
		};
	}, [wrapperRef]);

	return (
		<>
			<div className={styles.hamburgerWrapper}>
				<div className={styles.hamburger} onClick={toggleMenu}>
					<RxHamburgerMenu />
				</div>
			</div>
			<div
				ref={wrapperRef}
				className={`${styles.navWrapper} ${isOpen ? styles.open : ""}`}>
				<div className={styles.exitCrossWrapper}>
					<div className={styles.exitCross} onClick={toggleMenu}>
						<RxCross2 />
					</div>
				</div>

				<div className={styles.logoWrapper}>
					<Link className={styles.logo} href="/" onClick={toggleMenu}>
						<Logo />
						<h1>Grand Ledger</h1>
					</Link>
				</div>

				<div className={styles.nav}>
					<DesktopNav
						currentRoute={currentRoute}
						toggleMenu={toggleMenu}
					/>
				</div>
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
