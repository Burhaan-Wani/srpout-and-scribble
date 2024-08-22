"use client";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import React, { useState } from "react";
import Image from "next/image";
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";
const UserButton = ({ user }: Session) => {
    const { setTheme, theme } = useTheme();
    const [checked, setChecked] = useState(false);
    const router = useRouter();

    if (user) {
        return (
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                    <Avatar>
                        {user?.image && (
                            <Image
                                src={user.image}
                                alt={user.name!}
                                fill={true}
                                className="rounded-full"
                            />
                        )}
                        {!user.image && (
                            <AvatarFallback className="bg-primary/25">
                                {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-6" align="end">
                    <div className="mb-4 flex flex-col items-center rounded-lg bg-primary/10 p-4">
                        {user?.image && (
                            <Image
                                src={user.image}
                                alt={user.name!}
                                width={36}
                                height={36}
                                className="rounded-full"
                            />
                        )}
                        {!user.image && (
                            <Avatar>
                                <AvatarFallback className="bg-primary/25">
                                    {user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <p className="mt-2 text-xs font-bold">{user.name}</p>
                        <span className="text-xs font-medium text-secondary-foreground">
                            {user.email}
                        </span>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            router.push("/dashboard/orders");
                        }}
                        className="group cursor-pointer py-2 font-medium transition-all duration-500 ease-in-out"
                    >
                        <TruckIcon
                            size={14}
                            className="mr-3 transition-all duration-500 ease-out group-hover:translate-x-1"
                        />{" "}
                        My orders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            router.push("/dashboard/settings");
                        }}
                        className="group cursor-pointer py-2 font-medium transition-all duration-500 ease-in-out"
                    >
                        <Settings
                            size={14}
                            className="mr-3 transition-all duration-500 ease-out group-hover:rotate-180"
                        />{" "}
                        Settings
                    </DropdownMenuItem>
                    {theme && (
                        <DropdownMenuItem className="cursor-pointer py-2 font-medium transition-all duration-500 ease-in-out">
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="group flex items-center"
                            >
                                {theme === "light" ? (
                                    <Sun
                                        size={14}
                                        className="transition-all duration-500 ease-in-out group-hover:rotate-180 group-hover:text-yellow-600"
                                    />
                                ) : (
                                    <Moon
                                        size={14}
                                        className="group-hover:text-blue-400"
                                    />
                                )}
                                <p className="ml-3 text-secondary-foreground/75 text-yellow-600 dark:text-blue-400">
                                    {theme[0].toUpperCase() + theme?.slice(1)}{" "}
                                    Mode
                                </p>
                                <Switch
                                    className="scale-75"
                                    checked={checked}
                                    onCheckedChange={(e) => {
                                        setChecked((prev) => !prev);
                                        if (e) setTheme("dark");
                                        if (!e) setTheme("light");
                                    }}
                                />
                            </div>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        onClick={() => signOut()}
                        className="group cursor-pointer py-2 font-medium transition-all duration-500 focus:bg-destructive/10"
                    >
                        <LogOut
                            size={14}
                            className="mr-3 transition-all duration-300 ease-out group-hover:scale-90"
                        />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
};

export default UserButton;
