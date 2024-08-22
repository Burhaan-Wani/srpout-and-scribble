import { auth } from "@/auth";
import React from "react";
import Logo from "./Logo";
import UserButton from "./user-button";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";

const Nav = async () => {
    const session = await auth();
    return (
        <header className="py-6">
            <nav>
                <ul className="flex items-center justify-between">
                    <li>
                        <Link href={"/"} aria-label="sprout and scribble logo">
                            <Logo />
                        </Link>
                    </li>
                    {!session ? (
                        <li>
                            <Button asChild>
                                <Link
                                    className="flex gap-2"
                                    href={"/auth/login"}
                                >
                                    <LogIn size={16} />
                                    <span>Login</span>
                                </Link>
                            </Button>
                        </li>
                    ) : (
                        <li>
                            <UserButton
                                expires={session?.expires!}
                                user={session?.user}
                            />
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Nav;
