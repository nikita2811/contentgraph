import React from "react";
import type { DashboardData } from "../components/types/Dashboard";
import StatsRow from "../components/StateRow";
import QuickActions from "../components/QuickActions";
import RecentJobs from "../components/RecentJobs";
import "../css/Dashboard.css"

interface Props {
    data: DashboardData;
}

const getGreeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
};

const Dashboard: React.FC<Props> = ({ data }) => (
    <main className="cg-main">
        <div className="cg-page-header">
            <h1 className="cg-page-title">Dashboard</h1>
            <p className="cg-page-sub">{getGreeting()}, {data.userName}</p>
        </div>

        <StatsRow stats={data.stats} />
        <QuickActions />
        <RecentJobs jobs={data.recentJobs} />
    </main>
);

export default Dashboard;