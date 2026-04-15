export type JobStatus = "Done" | "Processing" | "Failed" | "Queued";
export type JobType = "Bulk CSV" | "Single";

export interface StatCard {
    label: string;
    value: string | number;
    subLabel: string;
}

export interface RecentJob {
    id: string;
    name: string;
    type: JobType;
    products: number;
    status: JobStatus;
    progress: number;
    date: string;
}

export interface DashboardData {
    userName: string;
    stats: StatCard[];
    recentJobs: RecentJob[];
    creditsRemaining: number;
    creditsTotal: number;
}