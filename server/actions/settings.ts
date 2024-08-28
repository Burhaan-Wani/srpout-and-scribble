"use server";

import { settingSchema } from "@/types/setting-schema";
import { actionClient } from "../safe-action";
import { auth } from "@/auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export const setting = actionClient
    .schema(settingSchema)
    .action(async ({ parsedInput: values }) => {
        const user = await auth();

        if (!user) {
            return { error: "You are not signed in" };
        }
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, user.user.id),
        });
        if (!dbUser) {
            return { error: "User not found" };
        }

        if (user.user.isOAuth) {
            values.email = undefined;
            values.password = undefined;
            values.newPassword = undefined;
            values.isTwoFactorEnabled = undefined;
        }
        if (values.password && values.newPassword && dbUser.password) {
            const passwordMatch = await bcrypt.compare(
                values.password,
                dbUser.password,
            );
            if (!passwordMatch) {
                return { error: "Password does not match" };
            }
            const samePassword = await bcrypt.compare(
                values.newPassword,
                dbUser.password,
            );

            if (samePassword) {
                return {
                    error: "New password cannot be the same as the old password",
                };
            }
            const hashedPassword = await bcrypt.hash(values.newPassword, 10);
            values.password = hashedPassword;
            values.newPassword = undefined;
        }
        const updatedUser = await db
            .update(users)
            .set({
                name: values.name,
                email: values.email,
                password: values.password,
                image: values.image,
                twoFactorEnabled: values.isTwoFactorEnabled,
            })
            .where(eq(users.id, dbUser.id));
        revalidatePath("/dashboard/settings");
        return {
            success: "Successfully updated your settings",
        };
    });
