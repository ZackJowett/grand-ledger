import MobileNav from "../nav/MobileNav";
import styles from "./Header.module.scss";
import Link from "next/link";

export default function Header({ currentRoute }) {
	return (
		<header className={styles.header}>
			<Link href="/" className={styles.title}>
				<h1>Grand Ledger</h1>
			</Link>
			<MobileNav currentRoute={currentRoute} />
		</header>
	);
}
