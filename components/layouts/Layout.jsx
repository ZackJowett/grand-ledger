import Head from "next/head";
import { useRouter } from "next/router";
import styles from "./Layout.module.scss";
import Header from "../sections/header/Header";
import DesktopNav from "../sections/nav/DesktopNav";
import { MdOutlineArrowBack } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { update } from "store/slices/usersSlice";
import { useEffect } from "react";
import { getAllUsers } from "utils/data/users";

export default function Layout({ children, className, includeBack = false }) {
	const state = useSelector((state) => state);
	const dispatch = useDispatch();
	const router = useRouter();

	// Load in users to Redux store
	useEffect(() => {
		// Only update the state if it has not been set yet
		if (state.users.ready && state.users.list.length > 0) return;

		getAllUsers().then((users) => {
			dispatch(update(users));
		});
	}, [dispatch]);

	const currentRoute = router.pathname;

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
				<div className={styles.contentWrapper}>
					<DesktopNav
						currentRoute={currentRoute}
						className={styles.desktopNav}
					/>
					<section
						className={`${styles.children} ${
							className ? className : ""
						} ${includeBack ? styles.back : ""}`}>
						{includeBack && (
							<div
								className={styles.backButton}
								onClick={() => {
									router.back();
								}}>
								<MdOutlineArrowBack /> Back
							</div>
						)}
						{children}
					</section>
				</div>
			</main>
			{/* <Footer /> */}
		</>
	);
}
