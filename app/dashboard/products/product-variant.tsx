import React, { useCallback, useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { VariantsWithImagesTags } from "@/lib/infer-type";
import { useForm } from "react-hook-form";
import { variantSchema } from "@/types/variant-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@/components/ui/input";
import { InputTags } from "./input-tags";
import VariantImages from "./variantImages";
import { createVariant } from "@/server/actions/create-variant";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteVariant } from "@/server/actions/delete-variant";

interface ProductVariantProps {
    editMode: boolean;
    productID?: number;
    variant?: VariantsWithImagesTags;
    children: React.ReactNode;
}

const ProductVariant = ({
    editMode,
    productID,
    variant,
    children,
}: ProductVariantProps) => {
    const form = useForm<z.infer<typeof variantSchema>>({
        resolver: zodResolver(variantSchema),
        defaultValues: {
            tags: [],
            variantImages: [],
            color: "#000000",
            editMode,
            id: undefined,
            productID,
            productType: "Black Notebook",
        },
    });
    const [open, setOpen] = useState(false);
    const { execute, status } = useAction(createVariant, {
        onSuccess: (data) => {
            if (data.data?.error) {
                toast.error(data.data.error);
            }
            if (data.data?.success) {
                toast.success(data.data.success);
                form.reset();
                setOpen(false);
            }
        },
    });
    const variantAction = useAction(deleteVariant, {
        onSuccess: (data) => {
            if (data.data?.error) {
                toast.error(data.data.error);
            }
            if (data.data?.success) {
                toast.success(data.data.success);
                setOpen(false);
            }
        },
    });
    function onSubmit(values: z.infer<typeof variantSchema>) {
        console.log(values);
        execute(values);
    }

    const setEdit = useCallback(() => {
        if (!editMode) {
            form.reset();
        }
        if (editMode && variant) {
            form.setValue("editMode", true);
            form.setValue("id", variant.id);
            form.setValue("productID", variant.productID);
            form.setValue("color", variant.color);
            form.setValue(
                "tags",
                variant.variantTags.map((tag) => tag.tag),
            );
            form.setValue(
                "variantImages",
                variant.variantImages.map((img) => ({
                    name: img.name,
                    size: img.size,
                    url: img.url,
                })),
            );
        }
    }, [editMode, variant, form]);

    useEffect(() => {
        setEdit();
    }, [setEdit]);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="max-h-[660px] max-w-[440px] overflow-y-scroll sm:max-w-[660px] lg:max-w-screen-lg">
                <DialogHeader>
                    <DialogTitle>
                        {editMode ? "Edit" : "Create"} your variant
                    </DialogTitle>
                    <DialogDescription>
                        Manage your product variants here. You can add tags,
                        images, and more.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="productType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Pick a title for your variant"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Color</FormLabel>
                                    <FormControl>
                                        <Input type="color" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <InputTags
                                            {...field}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <VariantImages />
                        <div className="flex items-center justify-center gap-4">
                            {editMode && variant && (
                                <Button
                                    variant={"destructive"}
                                    type="button"
                                    disabled={
                                        variantAction.status === "executing"
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        variantAction.execute({
                                            id: variant.id,
                                        });
                                    }}
                                >
                                    Delete Variant
                                </Button>
                            )}
                            <Button
                                disabled={
                                    status === "executing" ||
                                    !form.formState.isValid ||
                                    !form.formState.isDirty
                                }
                                type="submit"
                            >
                                {editMode ? "Update Variant" : "Create Variant"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductVariant;
