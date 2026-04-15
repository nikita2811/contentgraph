import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────

type Tone = "Professional" | "Friendly" | "Luxury" | "Casual" | "Bold";

interface GeneratedOutput {
    description: string;
    wordCount: number;
    metaTitle: string;
    metaDescription: string;
    tags: string[];
}

// ─── Sub-components ───────────────────────────────────────────────

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handle = () => {
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button className="sp-copy-btn" onClick={handle}>
            {copied ? (
                <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied
                </>
            ) : "Copy"}
        </button>
    );
};

const OutputCard: React.FC<{
    label: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    copyText: string;
}> = ({ label, children, footer, copyText }) => (
    <div className="sp-output-card">
        <div className="sp-output-card-header">
            <span className="sp-output-label">{label}</span>
            <CopyButton text={copyText} />
        </div>
        <div className="sp-output-body">{children}</div>
        {footer && <div className="sp-output-footer">{footer}</div>}
    </div>
);

const Spinner: React.FC = () => (
    <div className="sp-spinner-wrap">
        <div className="sp-spinner" />
        <p className="sp-spinner-text">Generating your copy…</p>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────

const TONES: Tone[] = ["Professional", "Friendly", "Luxury", "Casual", "Bold"];
const CATEGORIES = ["Accessories", "Clothing", "Electronics", "Beauty", "Home & Garden", "Sports", "Food & Beverage", "Other"];

interface Props {
    credits: number;
    onCreditUsed?: () => void;
}

const SingleProductPage: React.FC<Props> = ({ credits, onCreditUsed }) => {
    const [productName, setProductName] = useState("Leather Minimalist Wallet");
    const [category, setCategory] = useState("Accessories");
    const [features, setFeatures] = useState("Slim design, RFID-blocking, 6 card slots, full-grain brown leather");
    const [audience, setAudience] = useState("");
    const [tone, setTone] = useState<Tone>("Professional");
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState<GeneratedOutput | null>({
        description:
            "Carry less, own more. This slim leather wallet fits 6 cards and your everyday essentials without the bulk — RFID-blocking technology keeps your cards safe from digital theft while the full-grain brown leather develops a rich patina with use. The perfect everyday carry for the modern minimalist.",
        wordCount: 176,
        metaTitle: "Leather Minimalist Wallet — Slim RFID-Blocking Card Holder",
        metaDescription:
            "Shop our slim RFID-blocking leather wallet. Holds 6 cards, built to last, and looks better with age. Free shipping on orders over $50.",
        tags: ["minimalist wallet", "leather wallet", "RFID wallet", "slim wallet", "card holder"],
    });

    const handleGenerate = async () => {
        if (!productName.trim() || !features.trim() || loading) return;
        setLoading(true);
        setOutput(null);

        // Simulate API call
        await new Promise((r) => setTimeout(r, 1800));

        setOutput({
            description: `${productName} — designed for those who value quality over quantity. ${features.split(",")[0]?.trim()} ensures ${audience ? `${audience} get` : "you get"} exactly what you need, nothing more. Built with premium materials, this product embodies the ${tone.toLowerCase()} approach to everyday essentials.`,
            wordCount: 48,
            metaTitle: `${productName} — ${features.split(",")[0]?.trim()} | ${category}`,
            metaDescription: `Discover the ${productName.toLowerCase()}. ${features.split(",").slice(0, 2).join(", ")}. Free shipping on orders over $50.`,
            tags: [
                productName.toLowerCase(),
                category.toLowerCase(),
                ...features.split(",").slice(0, 3).map((f) => f.trim().toLowerCase()),
            ],
        });

        setLoading(false);
        onCreditUsed?.();
    };

    const metaTitleLen = output?.metaTitle.length ?? 0;
    const metaDescLen = output?.metaDescription.length ?? 0;

    return (
        <div className="sp-root">
            {/* Left panel — form */}
            <div className="sp-form-panel">
                <div className="sp-panel-header">
                    <h1 className="sp-panel-title">Single product</h1>
                    <p className="sp-panel-sub">Fill in your product details and generate copy instantly.</p>
                </div>

                <div className="sp-form">
                    {/* Product name */}
                    <div className="sp-field">
                        <label className="sp-label">Product name</label>
                        <input
                            className="sp-input"
                            type="text"
                            placeholder="e.g. Leather Minimalist Wallet"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div className="sp-field">
                        <label className="sp-label">Category</label>
                        <div className="sp-select-wrap">
                            <select
                                className="sp-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                            <svg className="sp-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>

                    {/* Key features */}
                    <div className="sp-field">
                        <label className="sp-label">Key features <span className="sp-label-hint">(comma separated)</span></label>
                        <textarea
                            className="sp-textarea"
                            placeholder="Slim design, RFID-blocking, 6 card slots…"
                            value={features}
                            onChange={(e) => setFeatures(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Audience */}
                    <div className="sp-field">
                        <label className="sp-label">Target audience <span className="sp-label-hint">(optional)</span></label>
                        <input
                            className="sp-input"
                            type="text"
                            placeholder="e.g. men aged 25–40"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                        />
                    </div>

                    {/* Tone */}
                    <div className="sp-field">
                        <label className="sp-label">Tone</label>
                        <div className="sp-tone-grid">
                            {TONES.map((t) => (
                                <button
                                    key={t}
                                    className={`sp-tone-btn ${tone === t ? "sp-tone-btn--active" : ""}`}
                                    onClick={() => setTone(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate button */}
                    <div className="sp-generate-wrap">
                        <button
                            className={`sp-generate-btn ${loading ? "sp-generate-btn--loading" : ""} ${credits < 1 ? "sp-generate-btn--disabled" : ""}`}
                            onClick={handleGenerate}
                            disabled={loading || credits < 1}
                        >
                            {loading ? <span className="sp-btn-spinner" /> : null}
                            Generate description — 1 credit
                        </button>
                        <p className="sp-credits-note">You have {credits} credits remaining</p>
                    </div>
                </div>
            </div>

            {/* Right panel — output */}
            <div className="sp-output-panel">
                <h2 className="sp-output-heading">Generated output</h2>

                {loading && <Spinner />}

                {!loading && !output && (
                    <div className="sp-empty-state">
                        <div className="sp-empty-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <p className="sp-empty-title">No output yet</p>
                        <p className="sp-empty-sub">Fill in the form and click Generate to create your product copy.</p>
                    </div>
                )}

                {!loading && output && (
                    <div className="sp-output-list">
                        {/* Description */}
                        <OutputCard
                            label="DESCRIPTION"
                            copyText={output.description}
                            footer={<span className="sp-word-count">{output.wordCount} words</span>}
                        >
                            <p className="sp-output-text">{output.description}</p>
                        </OutputCard>

                        {/* Meta title */}
                        <OutputCard
                            label="META TITLE"
                            copyText={output.metaTitle}
                            footer={
                                <span className={`sp-char-count ${metaTitleLen > 60 ? "sp-char-count--over" : ""}`}>
                                    {metaTitleLen} / 60 chars
                                </span>
                            }
                        >
                            <p className="sp-output-text sp-output-text--meta">{output.metaTitle}</p>
                        </OutputCard>

                        {/* Meta description */}
                        <OutputCard
                            label="META DESCRIPTION"
                            copyText={output.metaDescription}
                            footer={
                                <span className={`sp-char-count ${metaDescLen > 155 ? "sp-char-count--over" : ""}`}>
                                    {metaDescLen} / 155 chars
                                </span>
                            }
                        >
                            <p className="sp-output-text">{output.metaDescription}</p>
                        </OutputCard>

                        {/* Tags */}
                        <div className="sp-output-card">
                            <div className="sp-output-card-header">
                                <span className="sp-output-label">TAGS</span>
                            </div>
                            <div className="sp-output-body">
                                <div className="sp-tags">
                                    {output.tags.map((tag) => (
                                        <span key={tag} className="sp-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Regenerate */}
                        <button className="sp-regen-btn" onClick={handleGenerate} disabled={loading || credits < 1}>
                            Regenerate — 1 credit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleProductPage;