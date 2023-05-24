import Nav from "../nav/MobileNav";
import styles from "./Header.module.scss";
import Link from "next/link";

export default function Header({ currentRoute }) {
	return (
		<header className={styles.header}>
			<Link href="/">
				<h1>Grand Ledger</h1>
			</Link>
			<Nav currentRoute={currentRoute} />
		</header>
	);
}
