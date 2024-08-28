"use server";

import { createOrderSchema } from "@/types/order-schema";
import { actionClient } from "../safe-action";
import { db } from "..";
import { orderProduct, orders } from "../schema";
import { auth } from "@/auth";

export const createOrder = actionClient
    .schema(createOrderSchema)
    .action(
        async ({
            parsedInput: { paymentIntentID, products, status, total },
        }) => {
            const user = await auth();
            if (!user) return { error: "user not found" };

            const order = await db
                .insert(orders)
                .values({
                    status,
                    paymentIntentID,
                    total,
                    userID: user.user.id,
                })
                .returning();
            const orderProducts = products.map(
                async ({ productID, quantity, variantID }) => {
                    const newOrderProduct = await db
                        .insert(orderProduct)
                        .values({
                            quantity,
                            orderID: order[0].id,
                            productID: productID,
                            productVariantID: variantID,
                        });
                },
            );
            return { success: "Order has been added" };
        },
    );
