// Standard handling of toasts
import { toast as reactToast } from "react-toastify";

export async function toast(promise, refresh = true, params) {
	try {
		if (!promise) {
			reactToast(params && params.error ? params.error : "Invalid", {
				position: "bottom-center",
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		} else {
			// custom toast promise
			reactToast(
				params && params.pending ? params.pending : "Loading...",
				{
					position: "bottom-center",
					autoClose: 1000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: true,
					progress: undefined,
					theme: "dark",
				}
			);

			await Promise.resolve(promise).then((data) => {
				console.log(data);

				if (data && data.success) {
					reactToast(
						params && params.success ? params.success : "Success!",
						{
							position: "bottom-center",
							autoClose: 1000,
							hideProgressBar: true,
							closeOnClick: true,
							pauseOnHover: false,
							draggable: true,
							progress: undefined,
							theme: "dark",
						}
					);

					if (refresh) {
						setTimeout(() => {
							window.location.reload();
						}, 1000);
					}
				} else {
					reactToast(
						params && params.error
							? `${params.error}: ${data.message}`
							: `${data.message}`,
						{
							position: "bottom-center",
							autoClose: 2000,
							hideProgressBar: true,
							closeOnClick: true,
							pauseOnHover: false,
							draggable: true,
							progress: undefined,
							theme: "dark",
						}
					);
				}
			});

			return promise;
		}
	} catch (error) {
		reactToast(`${params && params.error ? params.error : data.message}`, {
			position: "bottom-center",
			autoClose: 2000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: false,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	}
}

export async function toastPromise(promise, refresh = true, params) {
	const response = reactToast.promise(
		promise,
		{
			pending: params && params.pending ? params.pending : "Saving...",
			success: {
				render({ data }) {
					if (refresh) {
						setTimeout(() => {
							window.location.reload();
						}, 1000);
					}

					return params && params.success
						? params.success
						: refresh
						? "Saved! Refreshing..."
						: "Saved!";
				},
			},
			error: params && params.error ? params.error : "Error",
		},
		{ position: "bottom-center", theme: "dark", borderRadius: "100px" }
	);

	return response;
}
