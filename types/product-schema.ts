import { z } from "zod";

export const productSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(3, {
        message: "Title must be at least 3 characters long",
    }),
    description: z.string().min(40, {
        message: "Description must be at least 40 characters long",
    }),
    price: z.coerce
        .number({ invalid_type_error: "Price must be a number" })
        .positive({ message: "Price must be a positive number" }),
});
