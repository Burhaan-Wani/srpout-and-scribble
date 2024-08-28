import { auth } from "@/auth";
import SettingCard from "@/components/user-setting/setting-card";
import { redirect } from "next/navigation";

import React from "react";

const Settings = async () => {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/");
    }
    return <SettingCard expires={session.expires} user={session.user} />;
};

export default Settings;
