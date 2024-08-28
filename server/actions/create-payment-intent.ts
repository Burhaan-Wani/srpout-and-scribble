"use server";

import { paymentIntentSchema } from "@/types/payment-intent-schema";
import { actionClient } from "../safe-action";
import Stripe from "stripe";
import { auth } from "@/auth";

const stripe = new Stripe(process.env.SECRET_KEY!);

export const createPaymentIntent = actionClient
    .schema(paymentIntentSchema)
    .action(async ({ parsedInput: { amount, cart, currency } }) => {
        const user = await auth();
        if (!user) return { error: "You must be logged in to create an order" };
        if (!amount) return { error: "Amount is required" };

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                cart: JSON.stringify(cart),
            },
        });
        return {
            success: {
                paymentIntentID: paymentIntent.id,
                clientSecretID: paymentIntent.client_secret,
                user: user.user.email,
            },
        };
    });
