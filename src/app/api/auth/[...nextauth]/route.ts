import NextAuth, { User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/Users";

declare module "next-auth" {
  interface Session {
    user: NextAuthUser & { id: string };
  }
}

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signOut: "/", // Redirects to home page after sign-out
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

      return true; // Allow sign-in
    },
    async session({ session }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user?.email });

      if (dbUser) {
        session.user!.id = dbUser._id;
      }

      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl + "/home";
    },
  },
});

export { handler as GET, handler as POST };
