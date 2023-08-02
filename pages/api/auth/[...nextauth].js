import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getRootURL } from "/utils/helpers";

const rootURL = getRootURL();

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		AppleProvider({
			clientId: process.env.APPLE_ID,
			clientSecret: process.env.APPLE_SECRET,
		}),
		// ...add more providers here
		CredentialsProvider({
			async authorize(credentials, req) {
				// Authenticate user
				try {
					// Fetch user data
					const res = await fetch(rootURL + "api/users", {
						method: "POST",
						body: JSON.stringify(credentials),
						headers: { "Content-Type": "application/json" },
					});
					const userData = await res.json();

					// Check user returned status
					if (!userData.success || !userData.data) {
						return null;
					}

					// Get specific user details
					const storedUser = userData.data;

					// Check password match
					const match = await bcrypt.compare(
						credentials.password,
						storedUser.password
					);

					if (match) {
						//login
						console.log("PASSWORDS MATCH");
						return storedUser;
					} else {
						console.log("PASSWORDS DO NOT MATCH");
						return null;
					}
				} catch (error) {
					console.log(error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			// if (user?.username) {
			// 	token.username = user.username;
			// }
			if (user?._id) {
				token.id = user._id;
			}
			// if (user?.email) {
			// 	token.email = user.email;
			// }
			return token;
		},
		async session({ session, token }) {
			// session.user.username = token.username;
			// session.user.email = token.email;
			session.user.id = token.id;
			return session;
		},
		async signIn({ account, profile }) {
			if (account.provider === "google") {
				// Check if user exists in database
				const res = await fetch(rootURL + "api/users", {
					method: "POST",
					body: JSON.stringify({ email: profile.email }),
					headers: { "Content-Type": "application/json" },
				});
				const userData = await res.json();

				// Check user was returned
				if (!userData.success) {
					// User exists
					return true;
				} else {
					// User does not exist
					// Create user
					// TO DO
				}
			} else {
				return true;
			}
		},
	},
	pages: {
		signIn: "/login",
		// signOut: "/auth/signout",
		error: "/login", // Error code passed in query string as ?error=
		// verifyRequest: "/auth/verify-request", // (used for check email message)
		newUser: "/", // New users will be directed here on first sign in (leave the property out if not of interest)
	},
	secret: process.env.NEXT_PUBLIC_SECRET,
};

export default NextAuth(authOptions);
