import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
// import Main from "@/components/sections/Main/Main";

export default function Home() {
	// Login Session
	const { data: session } = useSession();

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
			<main>
				<h1>Grand Ledger</h1>
				<Link href="/private">Private page</Link>
				<br />
				<Link href="/debts">Debts</Link>
				<br />
				<Link href="/unreceived-payments">Unreceived Payments</Link>
				<br />
				<Link href="/profile">Profile</Link>
			</main>
		</>
	);
}
