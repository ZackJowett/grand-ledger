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
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: "Credentials",
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "Username",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value
				// that is false/null if the credentials are invalid.
				// e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
				// You can also use the `req` object to obtain additional parameters
				// (i.e., the request IP address)

				// Get root url based on environment
				try {
					// Fetch user data from api

					const res = await fetch(rootURL + "api/users", {
						method: "POST",
						body: JSON.stringify(credentials),
						headers: { "Content-Type": "application/json" },
					});
					const userData = await res.json();

					// Check user was returned
					if (!userData.success) {
						return null;
					}

					// Get specific user details
					const storedUser = userData.data;

					// Check password match
					if (storedUser.password != credentials.password) {
						console.log("Incorrect Password");
						return null;
					}

					// bcrypt.compare(
					// 	credentials.password,
					// 	storedUser.password,
					// 	function (err, result) {
					// 		if (result == true) {
					// 			console.log("It matches!");
					// 		} else {
					// 			console.log("Invalid password!");
					// 		}
					// 	}
					// );

					// If no error and we have user data, return it
					if (storedUser) {
						return storedUser;
					}
					// Return null if user data could not be retrieved
					return null;
				} catch (error) {
					console.log(error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			console.log(`user`, user);
			console.log(`token`, token);
			// if (user?.username) {
			// 	token.username = user.username;
			// }
			if (user?._id) {
				token.id = user._id;
			}
			if (user?.email) {
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }) {
			console.log("session", session);
			console.log("token2", token);

			session.user.username = token.username;
			session.user.email = token.email;
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

				console.log(profile);
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
