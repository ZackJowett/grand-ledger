import "/public/styles/globals.scss";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { Provider } from "react-redux";
import store from "../store/store";
import Layout from "../components/layouts/Layout";
import FullScreen from "../components/layouts/FullScreen";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoggedOut from "../components/sections/login/loggedOut/LoggedOut";
import Spinner from "../components/placeholders/spinner/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<>
			<Provider store={store}>
				<SessionProvider session={session}>
					<DynamicLayout
						Component={Component}
						pageProps={pageProps}
					/>
					<ToastContainer />
				</SessionProvider>
			</Provider>
			<Script
				src="https://apis.google.com/js/platform.js"
				async
				defer></Script>
		</>
	);
}

function DynamicLayout({ Component, pageProps }) {
	const { data: sessionData, status: sessionStatus } = useSession();
	const router = useRouter();

	// const layoutIncludeBack = ["login", "register"].includes(router.pathname);
	const layoutFullScreen = ["/login", "/register"].includes(router.pathname);

	if (layoutFullScreen) {
		return (
			<FullScreen>
				<Component {...pageProps} />
			</FullScreen>
		);
	} else if (sessionStatus === "loading") {
		return (
			<FullScreen>
				<Spinner />
			</FullScreen>
		);
	} else if (sessionStatus === "unauthenticated" && !layoutFullScreen) {
		return (
			<FullScreen>
				<LoggedOut />
			</FullScreen>
		);
	}

	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
}
