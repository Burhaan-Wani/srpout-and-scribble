"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { settingSchema } from "@/types/setting-schema";
import Image from "next/image";
import { Switch } from "../ui/switch";
import FormSuccess from "../auth/success";
import FormError from "../auth/error";
import { useAction } from "next-safe-action/hooks";
import { setting } from "@/server/actions/settings";
import { UploadButton } from "@/app/api/uploadthing/upload";

const SettingCard = ({ user }: Session) => {
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const form = useForm<z.infer<typeof settingSchema>>({
        resolver: zodResolver(settingSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: user?.name || undefined,
            email: user?.email || undefined,
            image: user?.image || undefined,
            isTwoFactorEnabled: user.isTwoFactorEnabled || undefined,
        },
    });
    const { status, execute } = useAction(setting, {
        onSuccess: (data) => {
            if (data.data?.error) {
                setError(data.data.error);
            }
            if (data.data?.success) {
                setSuccess(data.data.success);
            }
        },
        // onError catches errors from the server
        onError: (error) => {
            setError("Something went wrong");
        },
    });
    function onSubmit(values: z.infer<typeof settingSchema>) {
        execute(values);
    }

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                setSuccess(undefined);
            }, 2000);
        }
        if (error) {
            setTimeout(() => {
                setError(undefined);
            }, 2000);
        }
    }, [success, error]);
    return (
        <Card className="mb-10">
            <CardHeader>
                <CardTitle>Your Settings</CardTitle>
                <CardDescription>Update your account settings</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={status === "executing"}
                                            placeholder="John Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    <div className="flex items-center gap-4">
                                        {!form.getValues("image") && (
                                            <div className="font-bold">
                                                {user?.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        {form.getValues("image") && (
                                            <Image
                                                width={42}
                                                height={42}
                                                src={form.getValues("image")!}
                                                className="rounded-full"
                                                alt="user image"
                                            />
                                        )}
                                        <UploadButton
                                            className="ut:button:transition-all scale-75 ut-button:bg-primary/75 ut-button:ring-primary ut-button:duration-500 hover:ut-button:bg-primary/100 ut-allowed-content:hidden ut-label:hidden ut-label:bg-red-50"
                                            endpoint="avatarUploader"
                                            onUploadBegin={() => {
                                                setAvatarUploading(true);
                                            }}
                                            onUploadError={(error) => {
                                                form.setError("image", {
                                                    type: "validate",
                                                    message: error.message,
                                                });
                                                setAvatarUploading(false);
                                                return;
                                            }}
                                            onClientUploadComplete={(res) => {
                                                form.setValue(
                                                    "image",
                                                    res[0].url!,
                                                );
                                                setAvatarUploading(false);
                                                return;
                                            }}
                                            content={{
                                                button({ ready }) {
                                                    if (ready)
                                                        return (
                                                            <div>
                                                                Change Avatar
                                                            </div>
                                                        );
                                                    return (
                                                        <div>Uploading...</div>
                                                    );
                                                },
                                            }}
                                        />
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="hidden"
                                            disabled={status === "executing"}
                                            placeholder="User Image"
                                            {...field}
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
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            disabled={
                                                status === "executing" ||
                                                user?.isOAuth === true
                                            }
                                            placeholder="********"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            disabled={
                                                status === "executing" ||
                                                user?.isOAuth === true
                                            }
                                            placeholder="********"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Two Factor Authentication
                                    </FormLabel>
                                    <FormDescription>
                                        Enalbe two factor Authentication for
                                        your account
                                    </FormDescription>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={
                                                status === "executing" ||
                                                user?.isOAuth === true
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormSuccess message={success!} />
                        <FormError message={error!} />
                        <Button
                            type="submit"
                            disabled={status === "executing" || avatarUploading}
                        >
                            Update your settings
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default SettingCard;
