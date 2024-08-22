"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { format } from "path";
import formatPrice from "@/lib/format-price";

type ProductsProps = {
    variants: VariantsWithProduct[];
};

const Products = ({ variants }: ProductsProps) => {
    return (
        <main className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => (
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
