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
import { resetSchema } from "@/types/reset-schema";
import { reset } from "@/server/actions/password-reset";

const ResetForm = () => {
    const form = useForm<z.infer<typeof resetSchema>>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            email: "",
        },
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { execute, status } = useAction(reset, {
        onSuccess: (data) => {
            if (data.data?.error) {
                setError(data.data?.error);
            }
            if (data.data?.success) {
                setSuccess(data.data?.success);
            }
        },
    });
    const onSubmit = (values: z.infer<typeof resetSchema>) => {
        execute(values);
    };

    return (
        <AuthCard
            cardTitle="Forgot your password"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
            showSocials
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
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
                        <span>{"Send email"}</span>
                    </Button>
                </form>
            </Form>
        </AuthCard>
    );
};

export default ResetForm;
