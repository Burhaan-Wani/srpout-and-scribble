import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import ProductForm from "./product-form";

const AddProducts = async () => {
    const session = await auth();
    if (session?.user.role !== "admin") {
        redirect("/dashboard/settings");
    }

    return <ProductForm />;
};

export default AddProducts;
