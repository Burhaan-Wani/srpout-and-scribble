import { redirect } from "next/navigation";
import React from "react";

const Dashboard = () => {
    redirect("/dashboard/settings");
};

export default Dashboard;
