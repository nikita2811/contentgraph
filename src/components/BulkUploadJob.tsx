import React, { useState, useCallback, useEffect } from "react";
import "../css/BulkUpload.css"
import { api } from "../api/axiosInstance";

interface Props {
    credits: number;
}
type JobStatus = "completed" | "processing" | "failed" | "pending" | "success";

interface Job {
    id: string;
    name: string;
    status: JobStatus;
    products: number;
    total_products: number;
    createdAt: string;
    type: string;
    progress: number;
}

interface JobsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Job[];
}
interface BalanceCheckResponse {
    can_afford: boolean;
    balance: string;
    cost: string;
    shortfall: string;
    unit_price: string;
    tier: string;
    units: number;
}
type ToastType = "success" | "error" | "info";

function Toast({
    message,
    type,
    onClose,
}: {
    message: string;
    type: ToastType;
    onClose: () => void;
}) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`cb-toast cb-toast--${type}`}>
            {message}
            <button onClick={onClose} className="cb-toast-close">×</button>
        </div>
    );
}



const BulkUploadPage: React.FC<Props> = ({ credits }) => {
    const [file, setFile] = useState<File | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [rowCount, setRowCount] = useState<number | null>(null);
    const [balanceOk, setBalanceOk] = useState<boolean | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    // const [jobsCount, setJobsCount] = useState<number>(0);
    const [jobsPage, setJobsPage] = useState<number>(1);
    const [jobsNext, setJobsNext] = useState<string | null>(null);
    const [jobsLoading, setJobsLoading] = useState(true);
    // const [jobsError, setJobsError] = useState<string | null>(null);
    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
    }, []);

    const fetchJobs = useCallback(
        async (page: number = 1, append: boolean = false) => {
            try {
                setJobsLoading(true);
                // setJobsError(null);

                const response = await api.get<JobsResponse>(
                    "/content/jobs",
                    { params: { page, page_size: 10 } }
                );

                const { results, count, next } = response.data;

                setJobs(prev => append ? [...prev, ...results] : results);
                // setJobsCount(count);
                setJobsNext(next);
                setJobsPage(page);
                console.log(response)
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                // setJobsError("Unable to load recent jobs. Please try again.");
            } finally {
                setJobsLoading(false);
            }
        },
        []
    );
    const downloadJob = useCallback(
        async (job_id: string) => {
            try {
                const response = await api.get(
                    `/content/download/${job_id}`,
                    { responseType: "blob" }
                );

                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `job_${job_id}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Failed to download job:", error);
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

    const checkBalance = useCallback(async (units: number): Promise<BalanceCheckResponse> => {
        const { data } = await api.post<BalanceCheckResponse>(
            "payment/balance-check",
            { units },
        );
        return data;
    }, []);
    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
        setRowCount(null);
        setBalanceOk(null);

        if (!selected) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const rows = text.trim().split("\n").length - 1; // exclude header
            setRowCount(rows);
            try {
                const result = await checkBalance(rows);
                setBalanceOk(result.can_afford);
                if (!result.can_afford) {
                    showToast(`Insufficient balance. You need ₹${result.shortfall} more. Top up your wallet.`, "error");
                }
            } catch {
                showToast("Could not verify balance. Please try again.", "error");
            }
        };
        reader.readAsText(selected);
    }, [showToast, checkBalance]);


    const handleUpload = useCallback(async () => {
        if (!file) return;
        if (balanceOk === false) {
            showToast("Insufficient credits. Please top up and try again.", "error");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await api.post("/content/upload-file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            showToast(response.data.message, "success");
        } catch (error) {
            showToast(error?.response?.data?.message || "Upload failed. Please try again.", "error");
        }
    }, [file, balanceOk, showToast]);



    return (
        <div className="bulk-page">
            {/* Hero */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <section className="bulk-hero">
                <div>
                    <h1>🚀 Bulk Product Generator</h1>
                    <p>
                        Upload hundreds of products and generate
                        SEO-optimized descriptions in minutes.
                    </p>
                </div>

                <div className="bulk-credit-pill">
                    ⚡ {credits} Credits
                </div>
            </section>

            {/* Top Grid */}
            <section className="bulk-top-grid">
                <div className="bulk-upload-card">
                    <h2>Upload CSV</h2>

                    <div className="bulk-dropzone">
                        <div className="bulk-upload-icon">☁️</div>

                        <h3>Drop CSV here</h3>

                        <p>
                            Upload up to 500 products and generate
                            descriptions in one click.
                        </p>

                        <input
                            id="csv-input"
                            type="file"
                            accept=".csv"
                            style={{ display: "none" }}
                            onChange={handleFileChange}

                        />
                        {!file ? (
                            <label htmlFor="csv-input" className="choose-file-btn">
                                Choose File
                            </label>
                        ) : (
                            <span className="file-name">
                                {file.name}
                                {rowCount !== null && (
                                    <span className={`row-count ${balanceOk === false ? "row-count--error" : ""}`}>
                                        ({rowCount} rows)
                                    </span>
                                )}
                                <button onClick={() => { setFile(null); setRowCount(null); setBalanceOk(null); }}>✕</button>
                            </span>
                        )}



                        <button onClick={handleUpload}>Upload</button>

                    </div>
                </div>

                {/* Analytics */}
                <div className="bulk-stats-card">
                    <h2>Batch Analytics</h2>

                    <div className="bulk-stats-grid">
                        <div className="bulk-stat">
                            <span>Total Jobs</span>
                            <strong>32</strong>
                        </div>

                        <div className="bulk-stat">
                            <span>Completed</span>
                            <strong>28</strong>
                        </div>

                        <div className="bulk-stat">
                            <span>Processing</span>
                            <strong>2</strong>
                        </div>

                        <div className="bulk-stat">
                            <span>Credits Used</span>
                            <strong>1284</strong>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Jobs */}
            <section className="bulk-jobs-card">
                {jobsLoading && jobs.length === 0 ? (
                    <div className="dashboard-loading">Loading jobs...</div>
                ) : jobs.length > 0 ? (
                    // Fix 2: wrap in a fragment, and Fix 3: render job_search not jobs
                    <>
                        <div className="bulk-card-header">
                            <h2>Recent Jobs</h2>
                        </div>

                        <table className="bulk-table">
                            <thead>
                                <tr>
                                    <th>Job Name</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                    <th>Products</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {jobs.filter((job) => job.type === "bulk")
                                    .map((job) => (

                                        <tr key={job.id}>
                                            <td>{job.name}</td>

                                            <td>
                                                <span className="status done">
                                                    {job.status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"

                                                        style={{
                                                            width: `${job.progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            <td>{job.total_products}</td>

                                            <td>
                                                {job.status === "completed" && (
                                                    <button className="action-btn" onClick={() => downloadJob(job.id)}>
                                                        Download
                                                    </button>
                                                )}
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

            {/* Activity
            <section className="bulk-activity-card">
                <h2>Recent Activity</h2>

                <ul>
                
                    <li>
                        ✅ Summer Collection completed
                    </li>
                    <li>
                        ⚡ 120 descriptions generated
                    </li>
                    <li>📥 CSV downloaded</li>
                    <li>
                        💳 120 credits consumed
                    </li>
                </ul>
            </section>

            {/* Template 
            <section className="bulk-template-card">
                <h2>Need a Template?</h2>

                <p>
                    Download a ready-to-use CSV format
                    and start generating descriptions
                    immediately.
                </p>

                <button>
                    Download CSV Template
                </button>
            </section> */}
        </div>
    );
};

export default BulkUploadPage;