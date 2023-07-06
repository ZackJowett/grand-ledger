import React from "react";
import ContentLoader from "react-content-loader";

export function NetPositionPlaceholder() {
	return (
		<ContentLoader
			speed={2}
			width="100%"
			height="300"
			viewBox="0 0 400 300"
			backgroundColor="#242424"
			foregroundColor="#333">
			<rect x="0" y="10" rx="5" ry="5" width="30%" height="10" />
			<rect x="0" y="30" rx="15" ry="15" width="100%" height="30" />
			<rect x="0" y="80" rx="5" ry="5" width="30%" height="10" />
			<rect x="0" y="100" rx="15" ry="15" width="100%" height="30" />
			<rect x="0" y="160" rx="1" ry="1" width="100%" height="3" />
			<rect x="35%" y="200" rx="5" ry="5" width="30%" height="30" />
			<rect x="40%" y="250" rx="15" ry="15" width="20%" height="30" />
		</ContentLoader>
	);
}

export function CardPlaceholder() {
	return (
		<ContentLoader
			speed={2}
			width="100%"
			height="100%"
			viewBox="0 0 400 150"
			backgroundColor="#242424"
			foregroundColor="#333">
			<rect x="0" y="10" rx="15" ry="15" width="100%" height="140" />
		</ContentLoader>
	);
}

export function NotificationPlaceholder() {
	return (
		<ContentLoader
			speed={2}
			width="100%"
			height="100%"
			viewBox="0 0 400 80"
			backgroundColor="#242424"
			foregroundColor="#333">
			<rect x="0" y="10" rx="15" ry="15" width="100%" height="70" />
		</ContentLoader>
	);
}
