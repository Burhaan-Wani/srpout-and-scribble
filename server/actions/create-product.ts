"use server";

import { productSchema } from "@/types/product-schema";
import { actionClient } from "../safe-action";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createProduct = actionClient
    .schema(productSchema)
    .action(async ({ parsedInput: { description, price, title, id } }) => {
        try {
            if (id) {
                const editProduct = await db.query.products.findFirst({
                    where: eq(products.id, id),
                });
                if (!editProduct) {
                    return { error: "Product not found" };
                }
                await db
                    .update(products)
                    .set({
                        description,
                        price,
                        title,
                    })
                    .where(eq(products.id, id));
                revalidatePath("/dashboard/products");

                return { success: "Product updated successfully" };
            }
            if (!id) {
                await db.insert(products).values({
                    description,
                    price,
                    title,
                });
                revalidatePath("/dashboard/products");
                return { success: "Product created successfully" };
            }
        } catch (error) {
            return { error: "Failed to create product" };
        }
    });
