import MobileNav from "../nav/MobileNav";
import styles from "./Header.module.scss";
import Link from "next/link";
import Logo from "components/logo/Logo";
import NotificationBox from "components/notifications/NotificationBox";

export default function Header({ currentRoute }) {
	return (
		<header className={styles.header}>
			<div className={styles.floatingHeader}>
				<div className={styles.navWrapper}>
					<MobileNav currentRoute={currentRoute} />
				</div>
				<Link href="/" className={styles.titleWrapper}>
					<Logo />
					<h1 className={styles.title}>Grand Ledger</h1>
				</Link>
				<div className={styles.notificationWrapper}>
					<NotificationBox />
				</div>
			</div>
		</header>
	);
}
