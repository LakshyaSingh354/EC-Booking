import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/Users";
import { Consultant } from "@/models/Consultants";
import { cookies } from "next/headers"; // Import from next/headers

declare module "next-auth" {
  interface CustomUser extends NextAuthUser {
    id: string;
    role: string;
    _id: string; // Add MongoDB _id
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
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline", // This tells Google to send a refresh token
      prompt: "consent", 
        },
      },
    }),
  ],
  pages: {
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        await connectDB();
        const cookieStore = cookies();
        const role = (await cookieStore).get("authRole")?.value || "user";

        let existingUser = await User.findOne({ email: user.email });
        let existingConsultant = await Consultant.findOne({ email: user.email });

        // Create user if not found
        console.log("Role::", role);
        if (!existingUser && !existingConsultant) {
          if (role === "user") {
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              avatar: user.image,
            });
          } else {
            existingConsultant = await Consultant.create({
              name: user.name,
              email: user.email,
              avatar: user.image,
              googleAccessToken: account!.access_token,
              googleRefreshToken: account!.refresh_token,
            });
          }
        }

        // Store _id and role in token
        token._id = (existingUser?._id || existingConsultant?._id)?.toString();
        token.role = role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        // id: token.sub!,
        id: token._id as string, // Include MongoDB _id
        role: token.role as string,
      };
      return session;
    },
  },
};
