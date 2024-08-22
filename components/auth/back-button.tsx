import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

type BackButtonProps = {
    href: string;
    label: string;
};

const BackButton = ({ href, label }: BackButtonProps) => {
    return (
        <Button asChild variant={"link"} className="w-full font-medium">
            <Link aria-label={label} href={href}>
                {label}
            </Link>
        </Button>
    );
};

export default BackButton;
