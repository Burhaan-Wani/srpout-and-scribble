import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(8, { message: "Password is required" }),
    code: z.optional(z.string()),
});
