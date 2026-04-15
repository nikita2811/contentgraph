import React from "react";
import type { RecentJob, JobStatus } from "../components/types/Dashboard";

interface Props {
    jobs: RecentJob[];
}

const statusStyles: Record<JobStatus, { bg: string; color: string; border: string }> = {
    Done: { bg: "#f0faf5", color: "#1a6b44", border: "#b2dfc8" },
    Processing: { bg: "#eef4ff", color: "#3456a0", border: "#b8ccf4" },
    Failed: { bg: "#fff4f4", color: "#8b2020", border: "#f5b8b8" },
    Queued: { bg: "#fafaf0", color: "#6b6b1a", border: "#dfddb2" },
};

const ProgressBar: React.FC<{ value: number; status: JobStatus }> = ({ value, status }) => (
    <div className="cg-progress-track">
        <div
            className={`cg-progress-fill ${status === "Processing" ? "cg-progress-fill--animated" : ""}`}
            style={{ width: `${value}%` }}
        />
    </div>
);

const RecentJobs: React.FC<Props> = ({ jobs }) => (
    <div className="cg-section">
        <div className="cg-jobs-header">
            <p className="cg-section-label">Recent jobs</p>
            <button className="cg-view-all">View all</button>
        </div>

        <table className="cg-jobs-table">
            <thead>
                <tr>
                    {["Job name", "Type", "Products", "Status", "Progress", "Date"].map((h) => (
                        <th key={h} className="cg-th">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {jobs.map((job) => {
                    const s = statusStyles[job.status];
                    return (
                        <tr key={job.id} className="cg-tr">
                            <td className="cg-td cg-td--name">{job.name}</td>
                            <td className="cg-td cg-td--muted">{job.type}</td>
                            <td className="cg-td cg-td--muted">{job.products}</td>
                            <td className="cg-td">
                                <span
                                    className="cg-status-badge"
                                    style={{ background: s.bg, color: s.color, borderColor: s.border }}
                                >
                                    {job.status}
                                </span>
                            </td>
                            <td className="cg-td">
                                <ProgressBar value={job.progress} status={job.status} />
                            </td>
                            <td className="cg-td cg-td--muted">{job.date}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

export default RecentJobs;