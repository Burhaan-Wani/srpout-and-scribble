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
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import FormSuccess from "./success";
import FormError from "./error";
import { newPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";

const NewPasswordForm = () => {
    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: "",
        },
    });
    const token = useSearchParams().get("token");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { execute, status } = useAction(newPassword, {
        onSuccess: (data) => {
            if (data.data?.error) {
                setError(data.data?.error);
            }
            if (data.data?.success) {
                setSuccess(data.data?.success);
            }
        },
    });
    const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
        execute({ password: values.password, token });
    };

    return (
        <AuthCard
            cardTitle="Enter a new password"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
            showSocials
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="*********"
                                            {...field}
                                            type="password"
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormSuccess message={success} />
                        <FormError message={error} />
                        {/* <Button size="sm" variant={"link"} asChild>
                            <Link href={"/auth/reset"}>
                                Forgot your password
                            </Link>
                        </Button> */}
                    </div>
                    <Button
                        disabled={status === "executing"}
                        type="submit"
                        className={cn(
                            "my-4 w-full",
                            status === "executing" ? "animate-pulse" : "",
                        )}
                    >
                        <span>{"Reset Password"}</span>
                    </Button>
                </form>
            </Form>
        </AuthCard>
    );
};

export default NewPasswordForm;
