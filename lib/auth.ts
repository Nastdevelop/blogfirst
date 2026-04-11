import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Email dan password wajib");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("User tidak ditemukan");
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new Error("Password salah");
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Saat login pertama, user object tersedia
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      // Teruskan id dari token ke session
      if (token && session.user) {
        session.user.id  = token.id as string
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
};