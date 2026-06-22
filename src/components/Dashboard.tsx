import React, { useEffect, useState, useCallback } from "react";
import StatsRow from "./StateRow";
import { api } from "../api/axiosInstance"
import "../css/RecentJobs.css"


interface Job {
    id: string;
    type: "single" | "bulk";
    name: string;
    status: string;
    total_products: number;
    progress: number;
    created_at: string;
}
interface JobsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Job[];
}
interface DashboardStats {
    credits_used: {
        total: number;
        this_week: number;
    };
    descriptions_generated: {
        total: number;
    };
    bulk_jobs_run: {
        total: number;
        this_month: number;
    };
    avg_generation_time: {
        seconds: number;
    };
}


export interface StatCard {
    label: string;
    value: string | number;
    subLabel: string;
}

// types/user.ts

interface User {
    id: number;
    email: string;
    name: string;
    avatar_url: string | null;
    last_login: string | null;
}

function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}





const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    completed: { label: "Completed", className: "job-status--completed" },
    success: { label: "Completed", className: "job-status--completed" },
    failed: { label: "Failed", className: "job-status--failed" },
    processing: { label: "Processing", className: "job-status--processing" },
    pending: { label: "Pending", className: "job-status--pending" },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const config = STATUS_CONFIG[status] ?? { label: status, className: "job-status--pending" };
    return <span className={`job-status ${config.className}`}>{config.label}</span>;
};









const Dashboard: React.FC = () => {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsCount, setJobsCount] = useState<number>(0);
    const [jobsPage, setJobsPage] = useState<number>(1);
    const [jobsNext, setJobsNext] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [user, setUser] = useState<User[]>([]);
    const statCards: StatCard[] = [
        {
            label: "Credits Used",
            value: stats?.credits_used?.total ?? 0,
            subLabel: `${stats?.credits_used?.this_week ?? 0} this week`,
        },
        {
            label: "Descriptions Generated",
            value: stats?.descriptions_generated?.total ?? 0,
            subLabel: "All time",
        },
        {
            label: "Bulk Jobs",
            value: stats?.bulk_jobs_run?.total ?? 0,
            subLabel: `${stats?.bulk_jobs_run?.this_month ?? 0} this month`,
        },
        {
            label: "Avg Generation Time",
            value: `${stats?.avg_generation_time?.seconds ?? 0}s`,
            subLabel: "Per request",
        },
    ];

    const fetchStats = useCallback(async () => {
        try {
            const response = await api.get<DashboardStats>("/content/dashboard-stats");

            setStats(response.data);

            console.log(response.data);
        } catch (error) {
            console.error("Error loading stats", error);
        }
    }, []);





    const fetchJobs = useCallback(
        async (page: number = 1, append: boolean = false) => {
            try {
                setJobsLoading(true);
                setJobsError(null);

                const response = await api.get<JobsResponse>(
                    "/content/jobs",
                    {
                        params: {
                            page,
                            page_size: 10,
                        },
                    }
                );

                const {
                    results,
                    count,
                    next,
                } = response.data;

                setJobs(prev =>
                    append
                        ? [...prev, ...results]
                        : results
                );

                setJobsCount(count);
                setJobsNext(next);
                setJobsPage(page);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);

                setJobsError(
                    "Unable to load recent jobs. Please try again."
                );
            } finally {
                setJobsLoading(false);
            }
        },
        []
    );

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

        fetchJobs();
        fetchStats();
        fetchUser();
    }, []);
    const handleLoadMore = () => {
        if (jobsNext) fetchJobs(jobsPage + 1, true);
    };

    const getGreeting = (): string => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return "Good morning";
        }

        if (hour < 18) {
            return "Good afternoon";
        }

        return "Good evening";
    };
    const firstName =
        user?.name?.trim()?.split(" ")[0] || "User";
    return (
        <div className="dashboard">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="dashboard-hero">
                <div>
                    <h1>
                        {getGreeting()}, {firstName}
                        {" "}👋
                    </h1>
                    <p>
                        Create high-converting content, assets and campaigns with AI.
                    </p>
                </div>
            </section>

            {/* ── Stats — self-fetching, no props needed ────────────────────── */}
            <StatsRow stats={statCards} />

            {/* ── Recent jobs ───────────────────────────────────────────────── */}
            <section className="dashboard-recent-jobs">
                <div className="cg-jobs-header">
                    <h3 className="dashboard-section-title">Recent Jobs</h3>

                    {jobsCount > 0 && (
                        <span className="dashboard-section-count">
                            {jobsCount} total
                        </span>
                    )}
                </div>

                {jobsLoading && jobs.length === 0 ? (
                    <div className="dashboard-loading">
                        Loading jobs...
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Job Name</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                    <th>Products</th>
                                    <th>Created</th>
                                </tr>
                            </thead>

                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job.id}>
                                        <td>
                                            <div className="dashboard-job-cell">
                                                <span className="material-symbols-outlined">
                                                    {job.type === "bulk"
                                                        ? "table_rows"
                                                        : "article"}
                                                </span>

                                                <div>
                                                    <div className="job-name">
                                                        {job.name}
                                                    </div>


                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <StatusBadge status={job.status} />
                                        </td>

                                        <td>
                                            <div className="dashboard-progress">
                                                <div className="dashboard-progress-track">
                                                    <div
                                                        className="dashboard-progress-fill"
                                                        style={{
                                                            width: `${job.progress}%`,
                                                        }}
                                                    />
                                                </div>

                                                <span>
                                                    {job.progress}%
                                                </span>
                                            </div>
                                        </td>

                                        <td>{job.total_products}</td>

                                        <td>
                                            {relativeTime(job.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {jobsNext && (
                            <button
                                onClick={handleLoadMore}
                                disabled={jobsLoading}
                                className="dashboard-load-more"
                            >
                                {jobsLoading
                                    ? "Loading..."
                                    : "Load More"}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="dashboard-jobs-empty">
                        <span className="material-symbols-outlined">
                            inbox
                        </span>
                        <p>No jobs found</p>
                    </div>
                )}
            </section>

        </div>
    );

}
export default Dashboard;