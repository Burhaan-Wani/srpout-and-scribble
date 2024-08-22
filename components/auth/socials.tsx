"use client";

import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Socials = () => {
    return (
        <div className="flex w-full flex-col items-center gap-4">
            <Button
                variant={"outline"}
                className="flex w-full gap-4"
                onClick={() =>
                    signIn("google", {
                        redirect: false,
                        callbackUrl: "/",
                    })
                }
            >
                <p>Sign in with Google</p>
                <FcGoogle className="h-5 w-5" />
            </Button>
            <Button
                variant={"outline"}
                className="flex w-full gap-4"
                onClick={() =>
                    signIn("github", {
                        redirect: false,
                        callbackUrl: "/",
                    })
                }
            >
                <p>Sign in with Github</p>
                <FaGithub className="h-5 w-5" />
            </Button>
        </div>
    );
};

export default Socials;
