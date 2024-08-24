import Link from "next/link";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";
import { auth } from "@/auth";
import Logo from "./Logo";
import { UserButton } from "./user-button";

export default async function Nav() {
    const session = await auth();
    return (
        <header className="py-8">
            <nav>
                <ul className="flex items-center justify-between gap-4 md:gap-5">
                    <li className="flex flex-1">
                        <Link href="/" aria-label="sprout and scribble logo">
                            <Logo />
                        </Link>
                    </li>
                    <li className="relative flex items-center hover:bg-muted">
                        <CartDrawer />
                    </li>
                    {!session ? (
                        <li className="flex items-center justify-center">
                            <Button asChild>
                                <Link className="flex gap-2" href="/auth/login">
                                    <LogIn size={16} />
                                    <span>Login</span>
                                </Link>
                            </Button>
                        </li>
                    ) : (
                        <li className="flex items-center justify-center">
                            <UserButton
                                expires={session?.expires}
                                user={session?.user}
                            />
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
