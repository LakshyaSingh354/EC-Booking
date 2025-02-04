// config/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/Users";
import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
	interface CustomUser extends NextAuthUser {
		id: string;
	}

	interface Session {
		user: CustomUser;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		}),
	],
	pages: {
		signOut: "/",
	},
	callbacks: {
		async signIn({ user }) {
			await connectDB();
			const existingUser = await User.findOne({ email: user.email });

			if (!existingUser) {
				await User.create({
					name: user.name,
					email: user.email,
					avatar: user.image,
				});
			}

			return true;
		},
		async session({ session }) {
			await connectDB();
			const dbUser = await User.findOne({ email: session.user?.email });

			if (dbUser) {
				session.user = {
					...session.user,
					id: dbUser._id.toString(),
				};
			}

			return session;
		},
		async redirect({ baseUrl }) {
			return baseUrl + "/home";
		},
	},
};
