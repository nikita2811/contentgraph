import React, { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────

type JobStatus = "Done" | "Processing" | "Failed" | "Queued";
type JobType = "Bulk CSV" | "Single";

interface Job {
    id: string;
    name: string;
    type: JobType;
    status: JobStatus;
    products: number;
    progress: number;
    creditsUsed: number;
    createdAt: string;
    completedAt: string | null;
    duration: string | null;
}

// ─── Mock data ────────────────────────────────────────────────────

const ALL_JOBS: Job[] = [
    { id: "j01", name: "Summer collection", type: "Bulk CSV", status: "Done", products: 120, progress: 100, creditsUsed: 120, createdAt: "Today, 10:42am", completedAt: "Today, 10:44am", duration: "1m 52s" },
    { id: "j02", name: "Leather wallet v2", type: "Single", status: "Done", products: 1, progress: 100, creditsUsed: 1, createdAt: "Today, 11:05am", completedAt: "Today, 11:05am", duration: "1.8s" },
    { id: "j03", name: "Electronics range", type: "Bulk CSV", status: "Processing", products: 85, progress: 53, creditsUsed: 53, createdAt: "Today, 11:15am", completedAt: null, duration: null },
    { id: "j04", name: "Winter jackets", type: "Bulk CSV", status: "Done", products: 44, progress: 100, creditsUsed: 44, createdAt: "Yesterday, 3:10pm", completedAt: "Yesterday, 3:13pm", duration: "3m 01s" },
    { id: "j05", name: "Sports shoes Q1", type: "Bulk CSV", status: "Done", products: 200, progress: 100, creditsUsed: 200, createdAt: "2 days ago, 9:00am", completedAt: "2 days ago, 9:05am", duration: "5m 12s" },
    { id: "j06", name: "Yoga mat listing", type: "Single", status: "Failed", products: 1, progress: 0, creditsUsed: 0, createdAt: "2 days ago, 2:34pm", completedAt: null, duration: null },
    { id: "j07", name: "Home decor bundle", type: "Bulk CSV", status: "Done", products: 75, progress: 100, creditsUsed: 75, createdAt: "3 days ago, 8:15am", completedAt: "3 days ago, 8:18am", duration: "2m 44s" },
    { id: "j08", name: "Kitchen gadgets", type: "Bulk CSV", status: "Done", products: 50, progress: 100, creditsUsed: 50, createdAt: "4 days ago, 11:00am", completedAt: "4 days ago, 11:02am", duration: "2m 03s" },
    { id: "j09", name: "Camping gear v1", type: "Single", status: "Done", products: 1, progress: 100, creditsUsed: 1, createdAt: "5 days ago, 4:20pm", completedAt: "5 days ago, 4:20pm", duration: "1.6s" },
    { id: "j10", name: "Office supplies", type: "Bulk CSV", status: "Failed", products: 30, progress: 12, creditsUsed: 0, createdAt: "6 days ago, 1:00pm", completedAt: null, duration: null },
    { id: "j11", name: "Beauty essentials", type: "Bulk CSV", status: "Done", products: 60, progress: 100, creditsUsed: 60, createdAt: "7 days ago, 10:00am", completedAt: "7 days ago, 10:03am", duration: "2m 58s" },
    { id: "j12", name: "Travel accessories", type: "Single", status: "Done", products: 1, progress: 100, creditsUsed: 1, createdAt: "8 days ago, 9:30am", completedAt: "8 days ago, 9:30am", duration: "2.1s" },
];

// ─── Helpers ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<JobStatus, { bg: string; color: string; border: string }> = {
    Done: { bg: "#f0faf5", color: "#1a6b44", border: "#b2dfc8" },
    Processing: { bg: "#eef4ff", color: "#3456a0", border: "#b8ccf4" },
    Failed: { bg: "#fff4f4", color: "#8b2020", border: "#f5b8b8" },
    Queued: { bg: "#fafaf0", color: "#6b6b1a", border: "#dfddb2" },
};

// ─── Sub-components ───────────────────────────────────────────────

const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
    const s = STATUS_STYLES[status];
    return (
        <span className="jh-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
            {status}
        </span>
    );
};

const ProgressBar: React.FC<{ value: number; status: JobStatus }> = ({ value, status }) => {
    const color = status === "Processing" ? "#4a90d9" : status === "Failed" ? "#d94040" : "#2e8b57";
    return (
        <div className="jh-progress-track">
            <div
                className={`jh-progress-fill ${status === "Processing" ? "jh-progress-fill--animated" : ""}`}
                style={{ width: `${value}%`, background: color }}
            />
        </div>
    );
};

// ─── Expandable job row ───────────────────────────────────────────

const JobRow: React.FC<{ job: Job }> = ({ job }) => {
    const [expanded, setExpanded] = useState(false);
    const s = STATUS_STYLES[job.status];

    return (
        <>
            <tr
                className={`jh-tr jh-tr--clickable ${expanded ? "jh-tr--expanded" : ""}`}
                onClick={() => setExpanded((v) => !v)}
            >
                <td className="jh-td">
                    <div className="jh-job-name-cell">
                        <svg
                            className={`jh-expand-chevron ${expanded ? "jh-expand-chevron--open" : ""}`}
                            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className="jh-job-name">{job.name}</span>
                    </div>
                </td>
                <td className="jh-td jh-td--muted">{job.type}</td>
                <td className="jh-td jh-td--muted">{job.products}</td>
                <td className="jh-td"><StatusBadge status={job.status} /></td>
                <td className="jh-td">
                    <div className="jh-progress-cell">
                        <ProgressBar value={job.progress} status={job.status} />
                        <span className="jh-progress-label">{job.progress}%</span>
                    </div>
                </td>
                <td className="jh-td jh-td--muted">{job.creditsUsed}</td>
                <td className="jh-td jh-td--muted">{job.createdAt}</td>
                <td className="jh-td">
                    {job.status === "Done" && (
                        <button
                            className="jh-dl-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                const csv = `id,name\n${job.id},"${job.name}"`;
                                const blob = new Blob([csv], { type: "text/csv" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url; a.download = `${job.name.toLowerCase().replace(/\s+/g, "-")}.csv`; a.click();
                                URL.revokeObjectURL(url);
                            }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            CSV
                        </button>
                    )}
                    {job.status === "Failed" && (
                        <button className="jh-retry-btn" onClick={(e) => e.stopPropagation()}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Retry
                        </button>
                    )}
                </td>
            </tr>

            {expanded && (
                <tr className="jh-tr-detail">
                    <td colSpan={8}>
                        <div className="jh-detail-panel">
                            <div className="jh-detail-grid">
                                <div className="jh-detail-item">
                                    <span className="jh-detail-label">Job ID</span>
                                    <code className="jh-detail-val">{job.id}</code>
                                </div>
                                <div className="jh-detail-item">
                                    <span className="jh-detail-label">Type</span>
                                    <span className="jh-detail-val">{job.type}</span>
                                </div>
                                <div className="jh-detail-item">
                                    <span className="jh-detail-label">Created</span>
                                    <span className="jh-detail-val">{job.createdAt}</span>
                                </div>
                                <div className="jh-detail-item">
                                    <span className="jh-detail-label">Completed</span>
                                    <span className="jh-detail-val">{job.completedAt ?? "—"}</span>
                                </div>
                                <div className="jh-detail-item">
                                    <span className="jh-detail-label">Duration</span>
                                    <span className="jh-detail-val">{job.duration ?? "—"}</span>
                                </div>
                                <div className="jh-detail-item">
                                    <span className="jh-detail-label">Credits used</span>
                                    <span className="jh-detail-val">{job.creditsUsed}</span>
                                </div>
                                <div className="jh-detail-item">
                                    <span className="jh-detail-label">Products processed</span>
                                    <span className="jh-detail-val">{job.progress === 100 ? job.products : `${Math.round(job.products * job.progress / 100)} / ${job.products}`}</span>
                                </div>
                                <div className="jh-detail-item">
                                    <span className="jh-detail-label">Status</span>
                                    <StatusBadge status={job.status} />
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

// ─── Main page ────────────────────────────────────────────────────

type FilterStatus = "All" | JobStatus;
type SortField = "createdAt" | "products" | "creditsUsed";
type SortDir = "asc" | "desc";

const JobHistoryPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [typeFilter, setTypeFilter] = useState<"All" | JobType>("All");
    const [sortField, setSortField] = useState<SortField>("createdAt");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [page, setPage] = useState(1);
    const PER_PAGE = 8;

    const toggleSort = (field: SortField) => {
        if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDir("desc"); }
    };

    const processed = useMemo(() => {
        return ALL_JOBS
            .filter((j) =>
                (search === "" || j.name.toLowerCase().includes(search.toLowerCase())) &&
                (statusFilter === "All" || j.status === statusFilter) &&
                (typeFilter === "All" || j.type === typeFilter)
            )
            .sort((a, b) => {
                const mul = sortDir === "asc" ? 1 : -1;
                if (sortField === "products") return (a.products - b.products) * mul;
                if (sortField === "creditsUsed") return (a.creditsUsed - b.creditsUsed) * mul;
                return (ALL_JOBS.indexOf(a) - ALL_JOBS.indexOf(b)) * mul;
            });
    }, [search, statusFilter, typeFilter, sortField, sortDir]);

    const paginated = processed.slice(0, page * PER_PAGE);
    const hasMore = paginated.length < processed.length;

    const totalCredits = ALL_JOBS.reduce((s, j) => s + j.creditsUsed, 0);
    const doneCount = ALL_JOBS.filter((j) => j.status === "Done").length;
    const failedCount = ALL_JOBS.filter((j) => j.status === "Failed").length;

    const SortIcon: React.FC<{ field: SortField }> = ({ field }) => (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ opacity: sortField === field ? 1 : 0.3, marginLeft: 4 }}>
            {sortField === field && sortDir === "asc"
                ? <polyline points="18 15 12 9 6 15" />
                : <polyline points="6 9 12 15 18 9" />}
        </svg>
    );

    return (
        <div className="jh-root">
            {/* Header */}
            <div className="jh-header">
                <div>
                    <h1 className="jh-title">Job history</h1>
                    <p className="jh-sub">All description generation jobs across single and bulk runs.</p>
                </div>
            </div>

            {/* Summary stats */}
            <div className="jh-summary">
                {[
                    { label: "Total jobs", value: ALL_JOBS.length },
                    { label: "Completed", value: doneCount },
                    { label: "Failed", value: failedCount },
                    { label: "Credits consumed", value: totalCredits },
                ].map((s) => (
                    <div key={s.label} className="jh-summary-card">
                        <span className="jh-summary-val">{s.value}</span>
                        <span className="jh-summary-label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="jh-filters">
                <div className="jh-search-wrap">
                    <svg className="jh-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        className="jh-search"
                        placeholder="Search jobs…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>

                <div className="jh-filter-pills">
                    {(["All", "Done", "Processing", "Failed"] as FilterStatus[]).map((s) => (
                        <button
                            key={s}
                            className={`jh-filter-pill ${statusFilter === s ? "jh-filter-pill--active" : ""}`}
                            onClick={() => { setStatusFilter(s); setPage(1); }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <select
                    className="jh-type-select"
                    value={typeFilter}
                    onChange={(e) => { setTypeFilter(e.target.value as any); setPage(1); }}
                >
                    <option value="All">All types</option>
                    <option value="Bulk CSV">Bulk CSV</option>
                    <option value="Single">Single</option>
                </select>
            </div>

            {/* Table */}
            <div className="jh-table-wrap">
                <table className="jh-table">
                    <thead>
                        <tr>
                            <th className="jh-th">Job name</th>
                            <th className="jh-th">Type</th>
                            <th className="jh-th jh-th--sort" onClick={() => toggleSort("products")}>
                                Products <SortIcon field="products" />
                            </th>
                            <th className="jh-th">Status</th>
                            <th className="jh-th">Progress</th>
                            <th className="jh-th jh-th--sort" onClick={() => toggleSort("creditsUsed")}>
                                Credits <SortIcon field="creditsUsed" />
                            </th>
                            <th className="jh-th jh-th--sort" onClick={() => toggleSort("createdAt")}>
                                Created <SortIcon field="createdAt" />
                            </th>
                            <th className="jh-th" />
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="jh-empty-cell">
                                    <div className="jh-empty">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        <p>No jobs match your filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginated.map((job) => <JobRow key={job.id} job={job} />)
                        )}
                    </tbody>
                </table>
            </div>

            {/* Load more */}
            {hasMore && (
                <button className="jh-load-more" onClick={() => setPage((p) => p + 1)}>
                    Load more ({processed.length - paginated.length} remaining)
                </button>
            )}

            {!hasMore && processed.length > 0 && (
                <p className="jh-end-note">Showing all {processed.length} jobs</p>
            )}
        </div>
    );
};

export default JobHistoryPage;