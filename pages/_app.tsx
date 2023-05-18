import "/public/styles/globals.scss";
import { SessionProvider } from "next-auth/react";

import type { AppProps } from "next/app";
import Script from "next/script";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
			<Script
				src="https://apis.google.com/js/platform.js"
				async
				defer></Script>
		</>
	);
}
