import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api/axiosInstance";
import { usePolling } from "../hooks/usePolling";
import '../css/SinglePage.css';



export interface GeneratedOutput {
    status: "done" | "processing" | "failed";

    seo_title: string;
    meta_title: string;
    meta_description: string;

    tags: string[];

    primary_keyword: string;
    secondary_keyword: string;

    h1?: string;
    long_description?: string;
    generation_time_ms?: number;
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

interface Props {
    credits: number;
    onCreditUsed?: () => void;
}


const SingleProductPage: React.FC<Props> = ({
    credits,
    onCreditUsed,
}) => {
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [features, setFeatures] = useState("");
    const [audience, setAudience] = useState("");
    const [tone, setTone] = useState("");
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
    }, []);

    const [taskId, setTaskId] = useState<string | null>(
        null
    );
    const [units, setUnits] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [output, setOutput] =
        useState<GeneratedOutput | null>(null);

    const {
        status,
        isDone,
        result,
        error,
    } = usePolling<GeneratedOutput>(taskId);

    useEffect(() => {
        if (isDone && result) {
            setOutput(result);
            setLoading(false);
            onCreditUsed?.();
        }
    }, [isDone, result, onCreditUsed]);

    async function checkBalance(units: number): Promise<BalanceCheckResponse> {
        const { data } = await api.post<BalanceCheckResponse>(
            "payment/balance-check",
            { units },

        );
        return data;
    }
    useEffect(() => {
        if (error) {
            setLoading(false);
            showToast(error, "error");
        }
    }, [error]);
    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast(`${label} copied!`, "success");
        } catch {
            showToast("Failed to copy to clipboard.", "error");
        }
    };

    const handleGenerate = async (isRegenerate) => {
        const check = await checkBalance(units);
        if (!check.can_afford) {
            showToast(
                `Insufficient balance. You need ₹${check.shortfall} more. Top up your wallet.`, "error"
            );
            return;
        }
        if (!productName.trim()) {
            showToast("Product name is required.", "error");
            return;
        }

        setTaskId(null);   // ← stops any in-flight poll immediately
        setOutput(null);
        setLoading(true);


        try {
            const key_features = features
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean);

            const response = await api.post(
                "content/generate-content",
                {
                    product_name: productName,
                    category,
                    key_features,
                    target_audience: audience,
                    tone,
                    is_regenerate: isRegenerate,
                }
            );

            setTaskId(response.data.task_id);
        } catch {
            setLoading(false);
            showToast("Failed to start generation. Please try again.", "error");
        }
    };

    return (
        <div className="sp-page">
            {/* Hero */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <section className="sp-hero">
                <div>
                    <h1>Single Product Generator</h1>

                    <p>
                        Generate product descriptions,
                        metadata and SEO tags using AI.
                    </p>
                </div>

                <div className="sp-credit-pill">
                    ⚡ {credits} Credits
                </div>
            </section>

            {/* Main Layout */}
            <div className="sp-layout">
                {/* Left */}
                <aside className="sp-form-panel">
                    <h2>Product Details</h2>

                    <div className="sp-field">
                        <label>Product Name</label>

                        <input
                            type="text"
                            value={productName}
                            placeholder="Leather Minimalist Wallet"
                            onChange={(e) =>
                                setProductName(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="sp-field">
                        <label>Category</label>
                        <input
                            value={category}
                            placeholder="Lifestyle"
                            onChange={(e) =>
                                setCategory(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="sp-field">
                        <label>Key Features</label>

                        <textarea
                            rows={4}
                            value={features}
                            placeholder="RFID Protection, Slim Design, Premium Leather"
                            onChange={(e) =>
                                setFeatures(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="sp-field">
                        <label>
                            Target Audience
                        </label>

                        <input
                            value={audience}
                            placeholder="Men aged 25-40"
                            onChange={(e) =>
                                setAudience(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="sp-field">
                        <label>Tone</label>

                        <input
                            value={tone}
                            placeholder="Professional"
                            onChange={(e) =>
                                setTone(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <button
                        className="sp-generate-btn"
                        onClick={() => handleGenerate(false)}
                        disabled={loading}
                    >
                        {loading
                            ? "⚡ Generating..."
                            : "Generate Content"}
                    </button>



                    <p className="sp-credit-note">
                        Remaining Credits:{" "}
                        {credits}
                    </p>
                </aside>

                {/* Right */}
                <section className="sp-output-panel">
                    <div className="sp-output-header">
                        <h2>
                            Generated Content
                        </h2>
                    </div>

                    {!loading && !output && (
                        <div className="sp-empty-state">
                            <div className="sp-empty-icon">
                                ✨
                            </div>

                            <h3>
                                Ready to Generate
                            </h3>

                            <p>
                                Enter your product
                                details and generate
                                AI-powered content.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="sp-loading">
                            <div className="sp-spinner" />

                            <p>
                                Generating AI
                                Content...
                            </p>
                        </div>
                    )}

                    {status === "failed" && (
                        <div className="sp-error">
                            {error}
                        </div>
                    )}

                    {output && (
                        <div className="seo-output">

                            <div className="seo-status">
                                <span className="material-symbols-outlined">
                                    check_circle
                                </span>
                                Generated successfully
                            </div>

                            <div className="seo-card">
                                <div className="seo-card-header">
                                    <h3>SEO Title</h3>
                                    <button onClick={() => copyToClipboard(output.seo_title, "SEO Title")}>Copy</button>
                                </div>
                                <p>{output.seo_title}</p>
                            </div>

                            <div className="seo-card">
                                <div className="seo-card-header">
                                    <h3>Meta Title</h3>
                                    <button onClick={() => copyToClipboard(output.seo_title, "Meta Title")}>Copy</button>
                                </div>
                                <p>{output.meta_title}</p>
                            </div>

                            <div className="seo-card">
                                <div className="seo-card-header">
                                    <h3>Meta Description</h3>
                                    <button onClick={() => copyToClipboard(output.seo_title, "Meta Description")}>Copy</button>
                                </div>
                                <p>{output.meta_description}</p>
                            </div>

                            <div className="seo-keywords-grid">
                                <div className="seo-keyword-card">
                                    <span className="seo-label">
                                        Primary Keyword
                                    </span>

                                    <span className="seo-pill seo-pill--primary">
                                        {output.primary_keyword}
                                    </span>
                                </div>

                                <div className="seo-keyword-card">
                                    <span className="seo-label">
                                        Secondary Keywords
                                    </span>

                                    <div className="seo-pills">
                                        {output.secondary_keyword
                                            .split(",")
                                            .map((keyword) => (
                                                <span
                                                    key={keyword}
                                                    className="seo-pill"
                                                >
                                                    {keyword.trim()}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <div className="seo-card">
                                <h3>Tags</h3>

                                <div className="seo-pills">
                                    {output.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="seo-tag"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="seo-actions">
                                <button className="seo-btn-primary" onClick={() => handleGenerate(true)}   // ← was onClick={handleGenerate}
                                    disabled={loading}>

                                    {loading
                                        ? "⚡ Generating..."
                                        : "Regenerate Content for 1 Credit"}
                                </button>


                                <button className="seo-btn-secondary" onClick={() => copyToClipboard(
                                    [
                                        `SEO Title: ${output.seo_title}`,
                                        `Meta Title: ${output.meta_title}`,
                                        `Meta Description: ${output.meta_description}`,
                                        `Primary Keyword: ${output.primary_keyword}`,
                                        `Secondary Keywords: ${output.secondary_keyword}`,
                                        `Tags: ${output.tags.join(", ")}`,
                                    ].join("\n"),
                                    "All content"
                                )}>
                                    Copy All
                                </button>

                                {/*  <button className="seo-btn-secondary">
                                    Export JSON
                                </button> */}
                            </div>

                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default SingleProductPage;