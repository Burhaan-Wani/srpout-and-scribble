"use server";

import getBaseUrl from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmationLink = `${domain}/auth/new-verification?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "Sprout-drizzle <onboaring@resend.dev>",
        to: email,
        subject: "sprout and scribble - Confirmation Email",
        html: `<p>Click to <a href="${confirmationLink}"> confirm your email</a></p>`,
    });
    if (error) {
        console.log(error);
    }
    if (data) return data;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmationLink = `${domain}/auth/new-password?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "Sprout-drizzle <onboaring@resend.dev>",
        to: email,
        subject: "sprout and scribble - Reset Email",
        html: `<p>Click here to <a href="${confirmationLink}"> reset your email</a></p>`,
    });
    if (error) {
        console.log(error);
    }
    if (data) return data;
};

export const sendTwoFactorTokenByEmail = async (
    email: string,
    token: string,
) => {
    const { data, error } = await resend.emails.send({
        from: "Sprout-drizzle <onboaring@resend.dev>",
        to: email,
        subject: "sprout and scribble - Your 2 factor token",
        html: `<p>Your confirmation token is ${token}`,
    });
    if (error) {
        console.log(error);
    }
    if (data) return data;
};
