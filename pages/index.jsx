import { useSession } from "next-auth/react";
import Main from "../components/sections/main/Main";
import Layout from "../components/layouts/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUsers } from "../store/actions/userAction";

export default function Home() {
	// Login Session
	const { data: session } = useSession();

	// Load in Redux Store
	const dispatch = useDispatch();
	useSelector((state) => state.userList);

	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);

	return (
		<Layout>
			<Main />
		</Layout>
	);
}
