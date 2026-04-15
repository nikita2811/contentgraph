import type { DashboardData } from "./Dashboard";

export const mockDashboardData: DashboardData = {
    userName: "Nikita",
    creditsRemaining: 170,
    creditsTotal: 500,
    stats: [
        { label: "Credits used", value: "330", subLabel: "+48 this week" },
        { label: "Descriptions generated", value: "330", subLabel: "All time" },
        { label: "Bulk jobs run", value: "6", subLabel: "2 this month" },
        { label: "Avg generation time", value: "1.8s", subLabel: "Per product" },
    ],
    recentJobs: [
        { id: "j1", name: "Summer collection", type: "Bulk CSV", products: 120, status: "Done", progress: 100, date: "Today" },
        { id: "j2", name: "Leather wallet v2", type: "Single", products: 1, status: "Done", progress: 100, date: "Today" },
        { id: "j3", name: "Electronics range", type: "Bulk CSV", products: 85, status: "Processing", progress: 58, date: "Today" },
        { id: "j4", name: "Winter jackets", type: "Bulk CSV", products: 44, status: "Done", progress: 100, date: "Yesterday" },
    ],
};