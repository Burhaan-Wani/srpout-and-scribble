"use server";

import bcrypt from "bcryptjs";
import { actionClient } from "@/server/safe-action";
import { registerSchema } from "@/types/register-schema-types";
import { db } from "@/server/index";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";

export const emailRegister = actionClient
    .schema(registerSchema)
    .action(async ({ parsedInput: { email, password, name } }) => {
        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // check for an existing user
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });
        if (existingUser) {
            if (!existingUser.emailVerified) {
                const verificationToken =
                    await generateEmailVerificationToken(email);
                await sendVerificationEmail(
                    verificationToken[0].email,
                    verificationToken[0].token,
                );
                return { success: "Email confirmation resent" };
            }
            return { error: "User with this email already exists" };
        }

        // logic for when the user is not registered and send email for verification
        const user = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        });

        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
            verificationToken[0].email,
            verificationToken[0].token,
        );
        return { success: "Confirmation email sent" };
    });
