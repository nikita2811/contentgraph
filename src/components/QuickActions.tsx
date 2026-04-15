import React from "react";

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const actions = [
    {
        title: "Generate single description",
        desc: "Paste a product name and features, get copy in 2 seconds",
    },
    {
        title: "Bulk upload CSV",
        desc: "Upload up to 500 products and download results as CSV",
    },
];

const QuickActions: React.FC = () => (
    <div className="cg-section">
        <p className="cg-section-label">Quick actions</p>
        <div className="cg-actions-grid">
            {actions.map((a) => (
                <button key={a.title} className="cg-action-card">
                    <span className="cg-action-arrow"><ArrowIcon /></span>
                    <p className="cg-action-title">{a.title}</p>
                    <p className="cg-action-desc">{a.desc}</p>
                </button>
            ))}
        </div>
    </div>
);

export default QuickActions;