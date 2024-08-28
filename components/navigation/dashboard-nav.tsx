"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

type DashboardNavProps = {
    allLinks: {
        label: string;
        path: string;
        icon: React.JSX.Element;
    }[];
};

const DashboardNav = ({ allLinks }: DashboardNavProps) => {
    const pathname = usePathname();
    return (
        <nav className="mb-4 overflow-auto py-2">
            <ul className="flex gap-6 text-xs font-semibold">
                <AnimatePresence>
                    {allLinks.map((link) => (
                        <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
                            <Link
                                className={cn(
                                    "relative flex flex-col items-center gap-1",
                                    pathname === link.path && "text-primary",
                                )}
                                href={link.path}
                            >
                                {link.icon}
                                {link.label}
                                {pathname === link.path ? (
                                    <motion.div
                                        className="absolute -bottom-1 left-0 z-0 h-[2px] w-full rounded-full bg-primary"
                                        initial={{ scale: 0.7 }}
                                        animate={{ scale: 1 }}
                                        layoutId="underline"
                                        transition={{
                                            type: "spring",
                                            stiffness: 75,
                                        }}
                                    />
                                ) : null}
                            </Link>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </nav>
    );
};

export default DashboardNav;
