"use server";

import { reviewSchema } from "@/types/review-schema";
import { actionClient } from "../safe-action";
import { auth } from "@/auth";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";

export const addReview = actionClient
    .schema(reviewSchema)
    .action(async ({ parsedInput: { rating, comment, productID } }) => {
        try {
            const session = await auth();
            if (!session) {
                return {
                    error: "You must be logged in to leave a review",
                };
            }
            const reviewExists = await db.query.reviews.findFirst({
                where: and(
                    eq(reviews.productID, productID),
                    eq(reviews.userID, session.user.id),
                ),
            });
            if (reviewExists) {
                return {
                    error: "You have already reviewed this product",
                };
            }
            const newReview = await db
                .insert(reviews)
                .values({
                    rating,
                    comment,
                    productID,
                    userID: session.user.id,
                })
                .returning();
            revalidatePath(`/products/${productID}`);
            return { success: newReview[0] };
        } catch (error) {
            return { error: JSON.stringify(error) };
        }
    });
