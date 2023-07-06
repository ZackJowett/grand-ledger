import Head from "next/head";
import { useRouter } from "next/router";
import styles from "./FullScreen.module.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../store/actions/userAction";
import TextWithTitle from "../text/title/TextWithTitle";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Logo from "components/logo/Logo";

export default function FullScreen({ children, className, title }) {
	const router = useRouter();
	const currentRoute = router.pathname;

	// Session
	const { data: session, status } = useSession();

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
				<section className={styles.content}>
					{status != "authenticated" && (
						// Hide title & error if authenticated
						<>
							<Logo className={styles.logo} />
							<TextWithTitle
								title={title}
								className={styles.title}
							/>
						</>
					)}
					<div className={styles.children}>{children}</div>
				</section>
			</main>
		</>
	);
}
