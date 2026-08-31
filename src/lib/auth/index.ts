import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await db?.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.passwordHash) {
          throw new Error("No account found with this email");
        }

        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
    async signIn({ user, account }) {
      // For Google sign-in, create/update user in DB
      if (account?.provider === "google" && user?.email) {
        try {
          await db?.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
            },
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
            },
          });
        } catch (e) {
          console.error("Error upserting user:", e);
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
