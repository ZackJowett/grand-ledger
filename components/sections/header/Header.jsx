import MobileNav from "../nav/MobileNav";
import styles from "./Header.module.scss";
import Link from "next/link";
import Logo from "components/logo/Logo";

export default function Header({ currentRoute }) {
	return (
		<header className={styles.header}>
			<div className={styles.floatingHeader}>
				<Link href="/" className={styles.titleWrapper}>
					<Logo />
					<h1 className={styles.title}>Grand Ledger</h1>
				</Link>
				<MobileNav currentRoute={currentRoute} />
			</div>
		</header>
	);
}
