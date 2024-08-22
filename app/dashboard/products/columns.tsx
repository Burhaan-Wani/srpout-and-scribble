"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductVariant from "./product-variant";

type ProductColumn = {
    title: string;
    price: number;
    image: string;
    variants: VariantsWithImagesTags[];
    id: number;
};

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
    const product = row.original;
    const { execute } = useAction(deleteProduct, {
        onSuccess: (data) => {
            if (data.data?.success) {
                toast.success(data.data?.success);
            }
            if (data.data?.error) {
                toast.error(data.data?.error);
            }
        },
    });
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/50 dark:focus:bg-primary">
                    <Link href={`/dashboard/add-product?id=${product.id}`}>
                        Quick Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => execute({ id: product.id })}
                    className="cursor-pointer focus:bg-destructive/50 dark:focus:bg-destructive"
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "variants",
        header: "Variants",
        cell: ({ row }) => {
            const variants = row.getValue(
                "variants",
            ) as VariantsWithImagesTags[];
            return (
                <div className="flex items-center gap-[0.3rem]">
                    {variants.map((variant) => (
                        <div key={variant.id} className="scale-75">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <ProductVariant
                                                productID={variant.productID}
                                                variant={variant}
                                                editMode={true}
                                            >
                                                <div
                                                    className="h-5 w-5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            variant.color,
                                                    }}
                                                />
                                            </ProductVariant>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{variant.productType}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ))}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <ProductVariant
                                        editMode={false}
                                        productID={row.original.id}
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                    </ProductVariant>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create a new variant</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            const formattedPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price);
            return <div className="text-xs font-medium">{formattedPrice}</div>;
        },
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const cellImage = row.getValue("image") as string;
            const cellTitle = row.getValue("title") as string;
            return (
                <div>
                    <Image
                        src={cellImage}
                        alt={cellTitle}
                        width={50}
                        height={50}
                        className="rounded-md"
                    />
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ActionCell,
    },
];
