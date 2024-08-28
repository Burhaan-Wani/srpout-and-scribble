import { db } from "@/server";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import placeholder from "@/public/placeholder-user.jpg";

const Products = async () => {
    const products = await db.query.products.findMany({
        with: {
            productVariants: {
                with: { variantImages: true, variantTags: true },
            },
        },
        orderBy: (products, { desc }) => [products.id],
    });

    if (!products) throw new Error("No products found");

    const dataTable = products.map((product) => {
        const image =
            product?.productVariants[0]?.variantImages[0].url ||
            placeholder.src;
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            variants: product.productVariants,
            image: image,
        };
    });
    return (
        <div>
            <DataTable columns={columns} data={dataTable} />
        </div>
    );
};

export default Products;
