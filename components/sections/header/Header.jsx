import MobileNav from "../nav/MobileNav";
import styles from "./Header.module.scss";
import Link from "next/link";

export default function Header({ currentRoute }) {
	return (
		<header className={styles.header}>
			<div className={styles.floatingHeader}>
				<Link href="/" className={styles.title}>
					<h1>Grand Ledger</h1>
				</Link>
				<MobileNav currentRoute={currentRoute} />
			</div>
		</header>
	);
}
