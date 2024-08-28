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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/types/register-schema-types";
import * as z from "zod";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { emailRegister } from "@/server/actions/email.register";
import FormSuccess from "./success";
import FormError from "./error";

const RegisterForm = () => {
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { execute, status } = useAction(emailRegister, {
        onSuccess: (data) => {
            if (data.data?.error) setError(data.data?.error);
            if (data.data?.success) setSuccess(data.data?.success);
        },
    });
    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        execute(values);
    };
    return (
        <AuthCard
            cardTitle="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocials
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john doe"
                                            {...field}
                                            type="text"
                                            autoComplete="name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mt-4">
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
                        {success && <FormSuccess message={success} />}
                        {error && <FormError message={error} />}
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
                        <span>{"Register"}</span>
                    </Button>
                </form>
            </Form>
        </AuthCard>
    );
};

export default RegisterForm;
