import "/public/styles/globals.scss";
import { SessionProvider } from "next-auth/react";
import wrapper from "../store/store";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import Script from "next/script";
import store from "../store/store";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<>
			<Provider store={store}>
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</Provider>
			<Script
				src="https://apis.google.com/js/platform.js"
				async
				defer></Script>
		</>
	);
}
