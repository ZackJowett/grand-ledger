import Head from "next/head";
import { useRouter } from "next/router";
import styles from "./Layout.module.scss";
import Header from "../sections/header/Header";

export default function Layout({ children }) {
	const router = useRouter();
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
			<Header currentRoute={currentRoute} />
			<main className={styles.content}>{children}</main>
			{/* <Footer /> */}
		</>
	);
}
