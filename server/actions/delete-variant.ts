"use server";

import { z } from "zod";
import { actionClient } from "../safe-action";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteVariant = actionClient
    .schema(z.object({ id: z.number() }))
    .action(async ({ parsedInput: { id } }) => {
        try {
            const deletedVariant = await db
                .delete(productVariants)
                .where(eq(productVariants.id, id))
                .returning();
            revalidatePath("/dashboard/products");
            return { success: "Variant deleted successfully" };
        } catch (error) {
            return { error: "Failed to delete variant" };
        }
    });
