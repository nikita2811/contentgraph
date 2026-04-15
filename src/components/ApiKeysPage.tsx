import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────

interface ApiKey {
    id: string;
    name: string;
    key: string;
    created: string;
    lastUsed: string | null;
    status: "active" | "revoked";
    permissions: ("read" | "write")[];
}

// ─── Mock data ────────────────────────────────────────────────────

const INITIAL_KEYS: ApiKey[] = [
    {
        id: "k1",
        name: "Production",
        key: "cg_live_sk_4f8a2b91c3d7e6f0a5b8c2d4e7f1a3b6",
        created: "12 Jan 2026",
        lastUsed: "2 hours ago",
        status: "active",
        permissions: ["read", "write"],
    },
    {
        id: "k2",
        name: "Development",
        key: "cg_live_sk_9e3c7f2a1b5d8e0f4a7c9e2b5d8f1a4c",
        created: "3 Mar 2026",
        lastUsed: "Yesterday",
        status: "active",
        permissions: ["read", "write"],
    },
    {
        id: "k3",
        name: "CI/CD Pipeline",
        key: "cg_live_sk_1a4d7b0e3f6c9a2d5b8e1f4a7d0b3e6c",
        created: "28 Feb 2026",
        lastUsed: null,
        status: "revoked",
        permissions: ["read"],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────

const maskKey = (key: string) =>
    key.slice(0, 14) + "••••••••••••••••••" + key.slice(-4);

const generateKey = () => {
    const chars = "abcdef0123456789";
    const rand = (n: number) =>
        Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `cg_live_sk_${rand(8)}${rand(4)}${rand(4)}${rand(4)}${rand(12)}`;
};

// ─── Sub-components ───────────────────────────────────────────────

const CopyBtn: React.FC<{ text: string; small?: boolean }> = ({ text, small }) => {
    const [copied, setCopied] = useState(false);
    const handle = () => {
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button className={`ak-copy-btn ${small ? "ak-copy-btn--small" : ""}`} onClick={handle}>
            {copied ? (
                <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied
                </>
            ) : (
                <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                </>
            )}
        </button>
    );
};

const KeyCard: React.FC<{
    apiKey: ApiKey;
    onRevoke: (id: string) => void;
    onDelete: (id: string) => void;
    revoking: boolean;
}> = ({ apiKey, onRevoke, onDelete, revoking }) => {
    const [revealed, setRevealed] = useState(false);
    const isRevoked = apiKey.status === "revoked";

    return (
        <div className={`ak-key-card ${isRevoked ? "ak-key-card--revoked" : ""}`}>
            <div className="ak-key-top">
                <div className="ak-key-info">
                    <div className="ak-key-name-row">
                        <span className="ak-key-name">{apiKey.name}</span>
                        <span className={`ak-status-badge ${isRevoked ? "ak-status-badge--revoked" : "ak-status-badge--active"}`}>
                            {isRevoked ? "Revoked" : "Active"}
                        </span>
                    </div>
                    <div className="ak-key-meta">
                        <span>Created {apiKey.created}</span>
                        <span className="ak-meta-dot">·</span>
                        <span>Last used: {apiKey.lastUsed ?? "Never"}</span>
                        <span className="ak-meta-dot">·</span>
                        <span>
                            {apiKey.permissions.map((p) => (
                                <span key={p} className={`ak-perm-pill ak-perm-pill--${p}`}>{p}</span>
                            ))}
                        </span>
                    </div>
                </div>

                <div className="ak-key-actions">
                    {!isRevoked && (
                        <button
                            className="ak-action-btn ak-action-btn--revoke"
                            onClick={() => onRevoke(apiKey.id)}
                            disabled={revoking}
                        >
                            {revoking ? <span className="ak-mini-spinner" /> : "Revoke"}
                        </button>
                    )}
                    <button
                        className="ak-action-btn ak-action-btn--delete"
                        onClick={() => onDelete(apiKey.id)}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Key display */}
            <div className="ak-key-value-row">
                <code className="ak-key-value">
                    {revealed ? apiKey.key : maskKey(apiKey.key)}
                </code>
                <div className="ak-key-value-actions">
                    <button
                        className="ak-reveal-btn"
                        onClick={() => setRevealed((v) => !v)}
                    >
                        {revealed ? (
                            <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                                Hide
                            </>
                        ) : (
                            <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                Reveal
                            </>
                        )}
                    </button>
                    <CopyBtn text={apiKey.key} small />
                </div>
            </div>
        </div>
    );
};

// ─── Create key modal ──────────────────────────────────────────────

interface CreateModalProps {
    onClose: () => void;
    onCreate: (name: string, permissions: ("read" | "write")[]) => void;
    loading: boolean;
    newKey: string | null;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose, onCreate, loading, newKey }) => {
    const [name, setName] = useState("");
    const [perms, setPerms] = useState<("read" | "write")[]>(["read", "write"]);

    const togglePerm = (p: "read" | "write") =>
        setPerms((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );

    if (newKey) return (
        <div className="ak-modal-overlay" onClick={onClose}>
            <div className="ak-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ak-modal-header">
                    <h3 className="ak-modal-title">API key created</h3>
                    <button className="ak-modal-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="ak-modal-warn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Copy this key now — it won't be shown again.
                </div>
                <code className="ak-new-key-display">{newKey}</code>
                <div className="ak-modal-footer">
                    <CopyBtn text={newKey} />
                    <button className="ak-modal-done-btn" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="ak-modal-overlay" onClick={onClose}>
            <div className="ak-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ak-modal-header">
                    <h3 className="ak-modal-title">Create API key</h3>
                    <button className="ak-modal-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="ak-modal-body">
                    <div className="ak-modal-field">
                        <label className="ak-modal-label">Key name</label>
                        <input
                            className="ak-modal-input"
                            placeholder="e.g. Production, CI/CD"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="ak-modal-field">
                        <label className="ak-modal-label">Permissions</label>
                        <div className="ak-perm-checks">
                            {(["read", "write"] as const).map((p) => (
                                <label key={p} className="ak-perm-check">
                                    <input
                                        type="checkbox"
                                        checked={perms.includes(p)}
                                        onChange={() => togglePerm(p)}
                                    />
                                    <span className="ak-perm-check-label">
                                        <strong>{p === "read" ? "Read" : "Write"}</strong>
                                        <span>{p === "read" ? "Generate descriptions, view jobs" : "Create jobs, bulk upload"}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ak-modal-footer">
                    <button className="ak-modal-cancel-btn" onClick={onClose}>Cancel</button>
                    <button
                        className="ak-modal-create-btn"
                        onClick={() => onCreate(name, perms)}
                        disabled={!name.trim() || perms.length === 0 || loading}
                    >
                        {loading ? <span className="ak-mini-spinner ak-mini-spinner--white" /> : null}
                        Create key
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────

const ApiKeysPage: React.FC = () => {
    const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newKey, setNewKey] = useState<string | null>(null);
    const [revoking, setRevoking] = useState<string | null>(null);

    const handleCreate = async (name: string, permissions: ("read" | "write")[]) => {
        setCreating(true);
        await new Promise((r) => setTimeout(r, 1000));
        const key = generateKey();
        const newEntry: ApiKey = {
            id: `k${Date.now()}`,
            name,
            key,
            created: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            lastUsed: null,
            status: "active",
            permissions,
        };
        setKeys((prev) => [newEntry, ...prev]);
        setCreating(false);
        setNewKey(key);
    };

    const handleRevoke = async (id: string) => {
        setRevoking(id);
        await new Promise((r) => setTimeout(r, 800));
        setKeys((prev) => prev.map((k) => k.id === id ? { ...k, status: "revoked" } : k));
        setRevoking(null);
    };

    const handleDelete = (id: string) => {
        setKeys((prev) => prev.filter((k) => k.id !== id));
    };

    const activeCount = keys.filter((k) => k.status === "active").length;
    const revokedCount = keys.filter((k) => k.status === "revoked").length;

    return (
        <div className="ak-root">
            {/* Header */}
            <div className="ak-header">
                <div>
                    <h1 className="ak-title">API keys</h1>
                    <p className="ak-sub">Manage keys to authenticate requests to the ContentGraph API.</p>
                </div>
                <button className="ak-create-btn" onClick={() => { setShowModal(true); setNewKey(null); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create key
                </button>
            </div>

            {/* Stats row */}
            <div className="ak-stats-row">
                <div className="ak-stat">
                    <span className="ak-stat-val">{activeCount}</span>
                    <span className="ak-stat-label">Active keys</span>
                </div>
                <div className="ak-stat-divider" />
                <div className="ak-stat">
                    <span className="ak-stat-val">{revokedCount}</span>
                    <span className="ak-stat-label">Revoked keys</span>
                </div>
                <div className="ak-stat-divider" />
                <div className="ak-stat">
                    <span className="ak-stat-val">{keys.length}</span>
                    <span className="ak-stat-label">Total keys</span>
                </div>
            </div>

            {/* Keys list */}
            <div className="ak-keys-list">
                {keys.length === 0 ? (
                    <div className="ak-empty">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                        </svg>
                        <p>No API keys yet</p>
                        <span>Create your first key to start using the API</span>
                    </div>
                ) : (
                    keys.map((k) => (
                        <KeyCard
                            key={k.id}
                            apiKey={k}
                            onRevoke={handleRevoke}
                            onDelete={handleDelete}
                            revoking={revoking === k.id}
                        />
                    ))
                )}
            </div>

            {/* Docs callout */}
            <div className="ak-docs-callout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <div>
                    <p className="ak-docs-title">Read the API documentation</p>
                    <p className="ak-docs-sub">Learn how to authenticate, generate descriptions, and handle responses.</p>
                </div>
                <button className="ak-docs-btn">View docs →</button>
            </div>

            {/* Modal */}
            {showModal && (
                <CreateModal
                    onClose={() => { setShowModal(false); setNewKey(null); }}
                    onCreate={handleCreate}
                    loading={creating}
                    newKey={newKey}
                />
            )}
        </div>
    );
};

export default ApiKeysPage;