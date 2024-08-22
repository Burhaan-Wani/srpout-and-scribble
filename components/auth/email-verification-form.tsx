"use client";

import { newVerification } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import AuthCard from "./auth-card";
import FormSuccess from "./success";
import FormError from "./error";

const EmailVerificationForm = () => {
    const token = useSearchParams().get("token");
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVerification = useCallback(() => {
        if (success || error) return;
        if (!token) {
            setError("No token found");
            return;
        }
        newVerification(token).then((data) => {
            if (data.error) {
                setError(data.error);
            }
            if (data.success) {
                setSuccess(data.success);
                router.push("/auth/login");
            }
        });
    }, [error, router, token, success]);

    useEffect(() => {
        handleVerification();
    }, [handleVerification]);

    return (
        <AuthCard
            cardTitle="Verify your account"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
            showSocials
        >
            <div className="flex w-full flex-col items-center justify-center">
                <p>{!success || !error ? "Verifying email..." : null}</p>
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
        </AuthCard>
    );
};

export default EmailVerificationForm;
