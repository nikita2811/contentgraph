import React, { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────

type JobStatus = "Done" | "Processing" | "Failed";

interface BulkJob {
    id: string;
    name: string;
    products: number;
    status: JobStatus;
    progress: number;
    uploadedAt: string;
    creditsUsed: number;
}

// ─── Mock jobs ────────────────────────────────────────────────────

const INITIAL_JOBS: BulkJob[] = [
    { id: "j1", name: "Summer collection", products: 120, status: "Done", progress: 100, uploadedAt: "Uploaded today at 10:42am", creditsUsed: 120 },
    { id: "j2", name: "Electronics range", products: 85, status: "Processing", progress: 53, uploadedAt: "Uploaded today at 11:15am", creditsUsed: 85 },
    { id: "j3", name: "Winter jackets", products: 44, status: "Done", progress: 100, uploadedAt: "Uploaded yesterday", creditsUsed: 44 },
];

// ─── Sub-components ───────────────────────────────────────────────

const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
    const styles: Record<JobStatus, { bg: string; color: string; border: string }> = {
        Done: { bg: "#f0faf5", color: "#1a6b44", border: "#b2dfc8" },
        Processing: { bg: "#eef4ff", color: "#3456a0", border: "#b8ccf4" },
        Failed: { bg: "#fff4f4", color: "#8b2020", border: "#f5b8b8" },
    };
    const s = styles[status];
    return (
        <span className="bu-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
            {status}
        </span>
    );
};

const JobCard: React.FC<{ job: BulkJob }> = ({ job }) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        await new Promise((r) => setTimeout(r, 900));
        // Generate a dummy CSV blob
        const csv = `name,category,features,description\n"${job.name} product 1","Category","Feature A","Generated description here"`;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${job.name.toLowerCase().replace(/\s+/g, "-")}-results.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloading(false);
    };

    const isProcessing = job.status === "Processing";
    const progressColor = isProcessing ? "#4a90d9" : "#2e8b57";

    return (
        <div className="bu-job-card">
            <div className="bu-job-top">
                <div className="bu-job-info">
                    <p className="bu-job-name">{job.name} — {job.products} products</p>
                    <p className="bu-job-meta">{job.uploadedAt} · {job.creditsUsed} credits used</p>
                </div>
                <StatusBadge status={job.status} />
            </div>

            <div className="bu-job-actions">
                {job.status === "Done" ? (
                    <button className="bu-download-btn" onClick={handleDownload} disabled={downloading}>
                        {downloading ? (
                            <>
                                <span className="bu-btn-spinner" />
                                Downloading…
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download CSV
                            </>
                        )}
                    </button>
                ) : (
                    <button className="bu-download-btn bu-download-btn--disabled" disabled>
                        Processing…
                    </button>
                )}
            </div>

            <div className="bu-job-progress">
                <div className="bu-progress-track">
                    <div
                        className={`bu-progress-fill ${isProcessing ? "bu-progress-fill--animated" : ""}`}
                        style={{ width: `${job.progress}%`, background: progressColor }}
                    />
                </div>
                <span className="bu-progress-label">{job.progress} / {job.products}</span>
            </div>
        </div>
    );
};

// ─── Upload zone ──────────────────────────────────────────────────

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    file: File | null;
    credits: number;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, file, credits }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");

    const validate = (f: File): boolean => {
        if (!f.name.endsWith(".csv")) { setError("Only .csv files are accepted"); return false; }
        if (f.size > 5 * 1024 * 1024) { setError("File must be under 5MB"); return false; }
        setError("");
        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f && validate(f)) onFileSelect(f);
    }, [onFileSelect]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && validate(f)) onFileSelect(f);
    };

    // Estimate product count from file name or size
    const estimatedRows = file ? Math.min(500, Math.max(1, Math.round(file.size / 80))) : null;
    const estimatedCredits = estimatedRows ? `~${estimatedRows} credits estimated` : null;

    return (
        <div className="bu-upload-section">
            <div
                className={`bu-dropzone ${dragging ? "bu-dropzone--drag" : ""} ${file ? "bu-dropzone--has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".csv"
                    className="bu-file-input"
                    onChange={handleFileInput}
                />

                <div className="bu-upload-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                </div>

                {file ? (
                    <>
                        <p className="bu-drop-title" style={{ color: "#2e8b57" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: "inline", marginRight: 5 }}>
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {file.name}
                        </p>
                        <p className="bu-drop-sub">{(file.size / 1024).toFixed(0)} KB · Click to change file</p>
                    </>
                ) : (
                    <>
                        <p className="bu-drop-title">Drop your CSV here</p>
                        <p className="bu-drop-sub">or click to browse — max 500 rows, 5MB</p>
                    </>
                )}

                <button
                    className="bu-choose-btn"
                    onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                >
                    Choose file
                </button>
            </div>

            {error && <p className="bu-upload-error">{error}</p>}

            <div className="bu-upload-footer">
                <button className="bu-generate-btn" disabled={!file}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Upload and generate
                </button>
                {estimatedCredits && (
                    <span className="bu-credit-estimate">{estimatedCredits}</span>
                )}
                {!file && (
                    <span className="bu-credit-estimate">~120 credits estimated</span>
                )}
            </div>

            <p className="bu-credits-note">You have {credits} credits remaining</p>
        </div>
    );
};

// ─── CSV Format card ──────────────────────────────────────────────

const FormatCard: React.FC = () => (
    <div className="bu-format-card">
        <h3 className="bu-format-title">Required CSV format</h3>
        <div className="bu-format-code">
            <pre>{`name,category,features,audience
"Leather Wallet","Accessories",
"Slim, RFID-blocking","Men 25-45"
"Yoga Mat","Fitness",
"Non-slip, 6mm","Fitness fans"`}</pre>
        </div>
        <button className="bu-template-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download template CSV
        </button>
        <p className="bu-format-note">
            Only <code>name</code> and <code>features</code> are required. Category and audience improve output quality.
        </p>
    </div>
);

// ─── Main page ────────────────────────────────────────────────────

interface Props {
    credits: number;
}

const BulkUploadPage: React.FC<Props> = ({ credits }) => {
    const [file, setFile] = useState<File | null>(null);
    const [jobs] = useState<BulkJob[]>(INITIAL_JOBS);

    return (
        <div className="bu-root">
            {/* Header */}
            <div className="bu-header">
                <h1 className="bu-title">Bulk upload</h1>
                <p className="bu-sub">Upload a CSV of up to 500 products and download all descriptions at once.</p>
            </div>

            {/* Upload + format row */}
            <div className="bu-top-grid">
                <UploadZone file={file} onFileSelect={setFile} credits={credits} />
                <FormatCard />
            </div>

            {/* Recent jobs */}
            <div className="bu-jobs-section">
                <p className="bu-jobs-heading">Recent jobs</p>
                <div className="bu-jobs-list">
                    {jobs.map((job) => <JobCard key={job.id} job={job} />)}
                </div>
            </div>
        </div>
    );
};

export default BulkUploadPage;