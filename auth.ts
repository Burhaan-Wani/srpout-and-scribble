import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/index";
import Credentials from "next-auth/providers/credentials";
import { accounts, users } from "./server/schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "./types/login-schema-types";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET!,
    callbacks: {
        async jwt({ token, user }) {
            if (!token.sub) return token;

            const existingUser = await db.query.users.findFirst({
                where: eq(users.id, token.sub), // here token.sub is users id stored in JWT token who is logged in.
            });
            if (!existingUser) return token;

            const existingAccount = await db.query.accounts.findFirst({
                where: eq(accounts.userId, existingUser.id),
            });

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.twoFactorEnabled;
            token.image = existingUser.image;
            return token;
        },
        async session({ session, token }) {
            if (session || token.sub) {
                session.user.id = token.sub as string;
            }
            if (session.user || token.role) {
                session.user.role = token.role as string;
            }
            if (session.user) {
                session.user.isTwoFactorEnabled =
                    token.isTwoFactorEnabled as boolean;
                session.user.name = token.name as string;
                session.user.isOAuth = token.isOAuth as boolean;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
    providers: [
        Google({
            allowDangerousEmailAccountLinking: true,
        }),
        GitHub({ allowDangerousEmailAccountLinking: true }),
        Credentials({
            authorize: async (credentials) => {
                const validatedFields = loginSchema.safeParse(credentials);
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const user = await db.query.users.findFirst({
                        where: eq(users.email, email),
                    });
                    if (!user || !user.password) {
                        return null;
                    }
                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password,
                    );
                    if (passwordMatch) return user;
                }
                return null;
            },
        }),
    ],
});
