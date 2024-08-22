"use client";

import React, { useState } from "react";
import AuthCard from "./auth-card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/types/login-schema-types";
import * as z from "zod";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { emailSignIn } from "@/server/actions/email-signin";
import FormSuccess from "./success";
import FormError from "./error";

const LoginForm = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const { execute, status } = useAction(emailSignIn, {
        onSuccess: (data) => {
            if (data.data?.error) {
                setError(data.data?.error);
            }
            if (data.data?.success) {
                setSuccess(data.data?.success);
            }
            if (data.data?.twoFactor) {
                setShowTwoFactor(true);
            }
        },
    });
    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        execute(values);
    };

    return (
        <AuthCard
            cardTitle="Welcome back!"
            backButtonHref="/auth/register"
            backButtonLabel="Create a new Account"
            showSocials
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {`We've sent you a two factor code to
                                            your email`}
                                        </FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                {...field}
                                                maxLength={6}
                                                disabled={
                                                    status === "executing"
                                                }
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="johndoe@gmail.com"
                                                    {...field}
                                                    type="email"
                                                    autoComplete="email"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="mt-4">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="********"
                                                    {...field}
                                                    type="password"
                                                    autoComplete="current-password"
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        <FormSuccess message={success} />
                        <FormError message={error} />
                        <Button size="sm" variant={"link"} asChild>
                            <Link href={"/auth/reset"}>
                                Forgot your password
                            </Link>
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        className={cn(
                            "my-2 w-full",
                            status === "executing" ? "animate-pulse" : "",
                        )}
                    >
                        <span>{!showTwoFactor ? "Login" : "verify"}</span>
                    </Button>
                </form>
            </Form>
        </AuthCard>
    );
};

export default LoginForm;
