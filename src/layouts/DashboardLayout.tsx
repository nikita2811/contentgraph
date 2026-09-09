import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import Header from "../components/Header";
import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api/axiosInstance"


interface User {
    id: number;
    email: string;
    name: string | null;
    last_login: string | null;
    credits: number;
}


const DashboardLayout: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            setProfileLoading(true)
            const response = await api.get<User>("/auth/me");

            setUser(response.data);

            console.log(response.data);
        } catch (error) {
            console.error("Error loading user", error);
        } finally {
            setProfileLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);






    return (
        <div className="dash-shell">
            {/* Header */}
            {/* Top bar with hamburger (mobile only) */}
            <Sidebar
                collapsed={drawerOpen}
                onToggle={() => setDrawerOpen(!drawerOpen)}
                activeHref="/credits"
            />


            <div className="dash-content-col">
                <Header
                    user={
                        !profileLoading && user
                            ? { name: user.name ?? "Unknown", role: "Member", credits: user.credits }
                            : null
                    }
                />


                {/* Page content */}
                <main className="dash-main">
                    <Outlet />
                </main>
            </div>
        </div >
    );
};

export default DashboardLayout;