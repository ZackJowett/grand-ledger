import HamburgerMenu from "../hamburgerMenu/Hamburger";
import styles from "./Header.module.scss";
import Link from "next/link";

export default function Header({ currentRoute }) {
	return (
		<header className={styles.header}>
			<Link href="/">
				<h1>Grand Ledger</h1>
			</Link>
			<HamburgerMenu currentRoute={currentRoute} />
		</header>
	);
}
