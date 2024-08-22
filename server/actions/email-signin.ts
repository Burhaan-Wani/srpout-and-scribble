"use server";

import { actionClient } from "@/server/safe-action";
import { loginSchema } from "@/types/login-schema-types";
import { db } from "@/server/index";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "@/server/schema";
import {
    generateEmailVerificationToken,
    generateTwoFactorTokenByEmail,
    getTwoFactorTokenByEmail,
} from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const emailSignIn = actionClient
    .schema(loginSchema)
    .action(async ({ parsedInput: { email, password, code } }) => {
        try {
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            });
            // check if email exists
            if (existingUser?.email !== email) {
                return { error: "Email not found" };
            }

            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(
                    existingUser.email,
                );
                await sendVerificationEmail(
                    verificationToken[0].email,
                    verificationToken[0].token,
                );
                return { success: "Verification email sent" };
            }

            // 2FAuth

            if (existingUser.twoFactorEnabled && existingUser.email) {
                if (code) {
                    const twoFactorToken = await getTwoFactorTokenByEmail(
                        existingUser.email,
                    );
                    if (!twoFactorToken) {
                        return { error: "Invalid Token" };
                    }
                    if (twoFactorToken.token !== code) {
                        return { error: "Invalid Token" };
                    }
                    const hasExpired =
                        new Date(twoFactorToken.expires) < new Date();
                    if (hasExpired) {
                        return { error: "Token has expired" };
                    }
                    await db
                        .delete(twoFactorTokens)
                        .where(eq(twoFactorTokens.id, twoFactorToken.id));
                } else {
                    const token = await generateTwoFactorTokenByEmail(
                        existingUser.email,
                    );

                    if (!token) {
                        return { error: "Token not generated!" };
                    }

                    await sendTwoFactorTokenByEmail(
                        token[0].email,
                        token[0].token,
                    );
                    return { twoFactor: "Two Factor Token Sent!" };
                }
            }
            await signIn("credentials", {
                email,
                password,
                redirectTo: "/",
            });
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin": {
                        return { error: "Email or password is incorrect" };
                    }
                    case "AccessDenied":
                        return { error: error.message };
                    case "OAuthSignInError":
                        return { error: error.message };
                    default:
                        return { error: "Something went wrong" };
                }
            }
            throw error;
        }
    });
