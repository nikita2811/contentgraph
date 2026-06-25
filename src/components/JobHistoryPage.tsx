import { useMemo, useState, useCallback, useEffect } from "react";
import "../css/JobHistory.css";
import { api } from "../api/axiosInstance"

type JobStatus = "completed" | "processing" | "failed" | "pending" | "success";

interface Job {
    id: string;
    name: string;
    status: JobStatus;
    products: number;
    total_products: number;
    createdAt: string;
    progress: number;
}

interface JobsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Job[];
}

const JobHistoryPage = () => {
    const [search, setSearch] = useState("");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsPage, setJobsPage] = useState<number>(1);
    const [jobsNext, setJobsNext] = useState<string | null>(null);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState<string | null>(null);

    // Fix 1: add `jobs` to the dependency array
    const job_search = useMemo(() => {
        return jobs.filter((job) =>
            job.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, jobs]);

    const totalCredits = 10;

    const fetchJobs = useCallback(
        async (page: number = 1, append: boolean = false) => {
            try {
                setJobsLoading(true);
                setJobsError(null);

                const response = await api.get<JobsResponse>(
                    "/content/jobs",
                    { params: { page, page_size: 10 } }
                );

                const { results, count, next } = response.data;

                setJobs(prev => append ? [...prev, ...results] : results);
                setJobsNext(next);
                setJobsPage(page);
                console.log(response)
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                setJobsError("Unable to load recent jobs. Please try again.");
            } finally {
                setJobsLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleLoadMore = () => {
        if (jobsNext) fetchJobs(jobsPage + 1, true);
    };

    return (
        <div className="jh-page">
            {/* HERO */}
            <section className="jh-hero">
                <div>
                    <h1>📊 Job History</h1>
                    <p>Monitor AI generations, downloads and credits usage.</p>
                </div>
                {/* <button className="jh-range-btn">Last 30 Days</button> */}
            </section>

            {/* STATS */}
            <section className="jh-stats">
                <div className="jh-stat-card">
                    <strong>{jobs.length}</strong>
                    <span>Total Jobs</span>
                </div>
                <div className="jh-stat-card">
                    <strong>
                        {jobs.filter((j) => ["completed", "success"].includes(j.status)).length}
                    </strong>
                    <span>Completed</span>
                </div>
                <div className="jh-stat-card">
                    <strong>{jobs.filter((j) => j.status === "failed").length}</strong>
                    <span>Failed</span>
                </div>
                <div className="jh-stat-card">
                    <strong>{totalCredits}</strong>
                    <span>Credits Used</span>
                </div>
            </section>

            {/* SEARCH */}
            <section className="jh-toolbar">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </section>
            {jobsError && <p className="text-red-500">{jobsError}</p>}

            {/* TIMELINE */}
            <section className="jh-timeline">
                {jobsLoading && jobs.length === 0 ? (
                    <div className="dashboard-loading">Loading jobs...</div>
                ) : job_search.length > 0 ? (
                    // Fix 2: wrap in a fragment, and Fix 3: render job_search not jobs
                    <>
                        <h2>Activity Timeline</h2>
                        {job_search.map((job) => (
                            <div key={job.id} className="jh-timeline-card">
                                <div className="jh-dot" />
                                <div className="jh-content">
                                    <div className="jh-row">
                                        <h3>{job.name}</h3>
                                        <span className="jh-time">{job.createdAt}</span>
                                    </div>
                                    <p>{job.total_products} products</p>
                                    <span className={`jh-status ${job.status.toLowerCase()}`}>
                                        {job.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {jobsNext && (
                            <button
                                onClick={handleLoadMore}
                                disabled={jobsLoading}
                                className="dashboard-load-more"
                            >
                                {jobsLoading ? "Loading..." : "Load More"}
                            </button>
                        )}
                    </>
                ) : (
                    <div className="dashboard-jobs-empty">
                        <span className="material-symbols-outlined">inbox</span>
                        <p>No jobs found</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default JobHistoryPage;