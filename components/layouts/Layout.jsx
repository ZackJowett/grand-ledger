import Head from "next/head";
import { useRouter } from "next/router";
import styles from "./Layout.module.scss";
import Header from "../sections/header/Header";
import MobileNav from "../sections/nav/MobileNav";
import DesktopNav from "../sections/nav/DesktopNav";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../store/actions/userAction";

export default function Layout({ children, className }) {
	const router = useRouter();
	const currentRoute = router.pathname;

	// Load in Redux Store
	const dispatch = useDispatch();
	useSelector((state) => state.userList);

	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);

	return (
		<>
			<Head>
				<title>Grand Ledger</title>
				<meta name="Grand Ledger" content="" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/favicon/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon/favicon-16x16.png"
				/>
				<link rel="manifest" href="/favicon/site.webmanifest" />
			</Head>

			<main className={styles.main}>
				<Header currentRoute={currentRoute} />
				<div className={styles.content}>
					<DesktopNav
						currentRoute={currentRoute}
						className={styles.desktopNav}
					/>
					<section
						className={`${styles.children} ${
							className ? className : ""
						}`}>
						{children}
					</section>
				</div>
			</main>
			{/* <Footer /> */}
		</>
	);
}
