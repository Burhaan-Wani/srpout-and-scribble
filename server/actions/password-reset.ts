"use server";

import { resetSchema } from "@/types/reset-schema";
import { actionClient } from "@/server/safe-action";
import { db } from "@/server/index";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { generatePasswordResetToken } from "@/server/actions/tokens";
import { sendPasswordResetEmail } from "@/server/actions/email";

export const reset = actionClient
    .schema(resetSchema)
    .action(async ({ parsedInput: { email } }) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });
        if (!existingUser) {
            return { error: "User not found" };
        }

        const passwordResetToken = await generatePasswordResetToken(email);
        if (!passwordResetToken) {
            return { error: "Token not generated" };
        }

        await sendPasswordResetEmail(
            passwordResetToken[0].email,
            passwordResetToken[0].token,
        );
        return { success: "Reset Email Sent" };
    });
