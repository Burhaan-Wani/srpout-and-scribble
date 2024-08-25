"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";
import { Badge } from "../ui/badge";
import formatPrice from "@/lib/format-price";
import { useSearchParams } from "next/navigation";

type ProductsProps = {
    variants: VariantsWithProduct[];
};

const Products = ({ variants }: ProductsProps) => {
    const params = useSearchParams();
    const paramTag = params.get("tag");

    const filtered = useCallback(() => {
        if (paramTag && variants) {
            return variants.filter((variant) =>
                variant.variantTags.some((tag) => tag.tag === paramTag),
            );
        }
        return variants;
    }, [paramTag, variants]);
    return (
        <main className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {filtered().map((variant) => (
                <Link
                    className="py-2"
                    key={variant.id}
                    href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
                >
                    <Image
                        className="pb-2"
                        src={variant.variantImages[0].url}
                        width={720}
                        height={480}
                        alt={variant.product.title}
                        loading="lazy"
                    />
                    <div className="flex justify-between">
                        <div className="font-medium">
                            <h2>{variant.product.title}</h2>
                            <p className="text-sm text-muted-foreground">
                                {variant.productType}
                            </p>
                        </div>
                        <div>
                            <Badge variant={"secondary"} className="text-sm">
                                {formatPrice(variant.product.price)}
                            </Badge>
                        </div>
                    </div>
                </Link>
            ))}
        </main>
    );
};

export default Products;
