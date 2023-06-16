/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "/images/**",
			},
			{
				protocol: "https",
				hostname: "assets.vercel.com",
				port: "",
				pathname: "/images/**",
			},
		],
	},
	webpack: (config) => {
		config.resolve = {
			...config.resolve,
			fallback: {
				fs: false,
				path: false,
				os: false,
			},
		};
		return config;
	},
};

module.exports = nextConfig;
