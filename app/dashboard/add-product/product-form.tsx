"use client";

import { productSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/server/actions/get-product";

const ProductForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        },
        mode: "onChange",
    });
    const editMode = useSearchParams().get("id");
    const checkProduct = useCallback(
        async (id: number) => {
            if (editMode) {
                const { success: product, error } = await getProduct(id);
                if (error) {
                    toast.error(error);
                }
                if (product) {
                    form.setValue("description", product.description);
                    form.setValue("price", product.price);
                    form.setValue("title", product.title);
                    form.setValue("id", product.id);
                }
            }
        },
        [editMode, form],
    );

    useEffect(() => {
        if (editMode) {
            checkProduct(parseInt(editMode));
        }
    }, [editMode, checkProduct]);
    const { execute, status } = useAction(createProduct, {
        onSuccess: (data) => {
            if (data.data?.error) {
                toast.error(data.data?.error);
            }
            if (data.data?.success) {
                toast.success(data.data?.success);
                router.push("/dashboard/products");
            }
        },
    });
    const onSubmit = (values: z.infer<typeof productSchema>) => {
        execute(values);
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {editMode ? "Edit Product" : "Create Product"}
                </CardTitle>
                <CardDescription>
                    {editMode
                        ? "Make changes to existing product"
                        : "Add a brand new product"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Saekdong Stripe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap val={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Price</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <DollarSign
                                                size={36}
                                                className="rounded-md bg-muted p-2"
                                            />
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Your price in USD"
                                                step="0.1"
                                                min={0}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-full"
                            disabled={
                                status === "executing" ||
                                !form.formState.isValid ||
                                !form.formState.isDirty
                            }
                            type="submit"
                        >
                            {editMode ? "Save Changes" : "Create Product"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ProductForm;
