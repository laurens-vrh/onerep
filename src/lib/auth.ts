import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Twitch from "next-auth/providers/twitch";
import { prisma } from "./database/prisma";
import { SignInData, signInSchema } from "./schemas";
import { compare } from "bcryptjs";

function credentialsError(code: string) {
	const error = new CredentialsSignin();
	error.code = code;
	return error;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	pages: {
		signIn: "/auth/signin",
	},
	session: {
		strategy: "jwt",
	},
	providers: [
		Google({
			allowDangerousEmailAccountLinking: true,
			profile: (profile) => {
				if (!profile.email_verified)
					throw new Error(
						`Unverified email for Google user ${profile.name}: ${profile.email}`
					);

				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.image,
					username: profile.email.split("@")[0],
				};
			},
		}),
		Discord({
			allowDangerousEmailAccountLinking: true,
			profile: (profile) => {
				if (!profile.verified)
					throw new Error(
						`Unverified email for Discord user ${profile.username}: ${profile.email}`
					);

				return {
					id: profile.id,
					email: profile.email,
					username: profile.username,
				};
			},
		}),
		GitHub({
			allowDangerousEmailAccountLinking: true,
			profile: (profile) => {
				return {
					id: profile.id.toString(),
					email: profile.email,
					name: profile.name,
					username: profile.login,
					image: profile.avatar_url,
				};
			},
		}),
		Twitch({
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					claims: {
						id_token: { email: null, email_verified: null },
						userinfo: { picture: null },
					},
				},
			},
			profile: (profile) => {
				if (!profile.email_verified)
					throw new Error(
						`Unverified email for Twitch user ${profile.preferred_username}: ${profile.email}`
					);

				return {
					id: profile.sub,
					email: profile.email,
					image: profile.picture,
					username: profile.preferred_username,
				};
			},
		}),
		Credentials({
			async authorize(credentials) {
				const { success } = signInSchema.safeParse(credentials);
				if (!success) return null;
				const { usernameOrEmail, password } = credentials as SignInData;

				const user = await prisma.user.findFirst({
					where: {
						OR: [
							{ username: { mode: "insensitive", equals: usernameOrEmail } },
							{ email: usernameOrEmail.toLowerCase() },
						],
					},
					select: {
						id: true,
						email: true,
						username: true,
						role: true,
						password: true,
					},
				});

				if (!user) throw credentialsError("INVALID_CREDENTIALS");
				if (!user.password) throw credentialsError("MISSING_PASSWORD");
				if (!(await compare(password, user.password)))
					throw credentialsError("INVALID_CREDENTIALS");

				return {
					id: user.id,
					email: user.email,
					username: user.username,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (!user) return token;

			const databaseUser = await prisma.user.findUnique({
				where: {
					id: user.id,
				},
				select: {
					id: true,
					username: true,
					email: true,
					role: true,
				},
			});
			if (!databaseUser) return token;

			token.id = databaseUser.id;
			token.username = databaseUser.username;
			token.email = databaseUser.email;
			token.role = databaseUser.role;

			return token;
		},
		session({ session, token }) {
			return {
				...session,
				user: {
					id: token.id,
					username: token.username,
					email: token.email,
					role: token.role,
				},
			} as Session;
		},
		signIn({ profile }: { profile?: Record<string, any> }) {
			const keys = Object.keys(profile ?? {});
			if (keys.includes("verified") && profile!.verified !== true) return false;
			if (keys.includes("email_verified") && profile!.email_verified !== true)
				return false;
			return true;
		},
	},
});
