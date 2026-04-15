import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────

interface CreditPlan {
    id: string;
    name: string;
    price: number;
    credits: number;
    pricePerDesc: string;
    features: string[];
    popular: boolean;
    isCurrent: boolean;
}

interface FAQItem {
    question: string;
    answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────

const PLANS: CreditPlan[] = [
    {
        id: "free",
        name: "Free",
        price: 0,
        credits: 10,
        pricePerDesc: "$0 per description",
        features: ["Single generator", "API access", "No credit card"],
        popular: false,
        isCurrent: true,
    },
    {
        id: "starter",
        name: "Starter",
        price: 9,
        credits: 500,
        pricePerDesc: "$0.018 per description",
        features: ["Single + bulk", "CSV download", "API access"],
        popular: false,
        isCurrent: false,
    },
    {
        id: "growth",
        name: "Growth",
        price: 29,
        credits: 2000,
        pricePerDesc: "$0.014 per description",
        features: ["Single + bulk", "CSV download", "Priority queue", "API access"],
        popular: true,
        isCurrent: false,
    },
    {
        id: "scale",
        name: "Scale",
        price: 99,
        credits: 10000,
        pricePerDesc: "$0.0099 per description",
        features: ["Everything in Growth", "Faster processing", "Email support", "Usage analytics"],
        popular: false,
        isCurrent: false,
    },
];

const FAQS: FAQItem[] = [
    {
        question: "Do credits expire?",
        answer: "No. Credits never expire. Buy once, use whenever you need them.",
    },
    {
        question: "What counts as one credit?",
        answer: "One credit = one product description generated — including the description, meta title, meta description, and 5 tags. Regenerating uses one additional credit.",
    },
    {
        question: "Can I use the API with any plan?",
        answer: "Yes — all plans including Free include API access. Your credits work the same way via API as they do in the dashboard.",
    },
    {
        question: "What if a generation fails?",
        answer: "Failed generations are automatically refunded to your balance. You only pay for successful outputs.",
    },
];

// ─── Sub-components ───────────────────────────────────────────────

const CheckIcon: React.FC = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const PlanCard: React.FC<{
    plan: CreditPlan;
    onBuy: (plan: CreditPlan) => void;
    loading: boolean;
}> = ({ plan, onBuy, loading }) => (
    <div className={`cr-plan-card ${plan.popular ? "cr-plan-card--popular" : ""}`}>
        {plan.popular && (
            <div className="cr-popular-badge">Most popular</div>
        )}

        <div className="cr-plan-top">
            <p className="cr-plan-name">{plan.name}</p>
            <div className="cr-plan-price-row">
                <span className="cr-plan-price">${plan.price}</span>
                {plan.price > 0 && <span className="cr-plan-onetime">one-time</span>}
            </div>
            <p className="cr-plan-credits">
                {plan.credits.toLocaleString()} credit{plan.credits !== 1 ? "s" : ""}
            </p>
            <p className="cr-plan-per-desc">{plan.pricePerDesc}</p>
        </div>

        <ul className="cr-plan-features">
            {plan.features.map((f) => (
                <li key={f} className="cr-plan-feature">
                    <CheckIcon />
                    <span>{f}</span>
                </li>
            ))}
        </ul>

        <button
            className={`cr-plan-btn ${plan.isCurrent ? "cr-plan-btn--current" : "cr-plan-btn--buy"}`}
            onClick={() => !plan.isCurrent && onBuy(plan)}
            disabled={plan.isCurrent || loading}
        >
            {loading && !plan.isCurrent ? (
                <span className="cr-btn-spinner" />
            ) : null}
            {plan.isCurrent ? "Current plan" : `Buy ${plan.name}`}
        </button>
    </div>
);

const FAQRow: React.FC<FAQItem> = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`cr-faq-item ${open ? "cr-faq-item--open" : ""}`}>
            <button className="cr-faq-q" onClick={() => setOpen((v) => !v)}>
                <span>{question}</span>
                <svg
                    className={`cr-faq-chevron ${open ? "cr-faq-chevron--open" : ""}`}
                    width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            <div className={`cr-faq-body ${open ? "cr-faq-body--open" : ""}`}>
                <p className="cr-faq-a">{answer}</p>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────

interface Props {
    credits: number;
    creditsTotal: number;
}

const CreditsPage: React.FC<Props> = ({ credits, creditsTotal }) => {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [purchased, setPurchased] = useState<string | null>(null);

    const handleBuy = async (plan: CreditPlan) => {
        setLoadingPlan(plan.id);
        await new Promise((r) => setTimeout(r, 1200));
        setLoadingPlan(null);
        setPurchased(plan.id);
        setTimeout(() => setPurchased(null), 3000);
    };

    const pct = Math.min(100, Math.round((credits / creditsTotal) * 100));

    return (
        <div className="cr-root">
            {/* Top nav */}
            <header className="cr-topnav">
                <div className="cr-topnav-logo">
                    <span className="cr-logo-content">content</span>
                    <span className="cr-logo-graph">graph</span>
                </div>
                <div className="cr-topnav-actions">
                    <a href="/dashboard" className="cr-topnav-btn">Dashboard</a>
                    <a href="/credits" className="cr-topnav-btn cr-topnav-btn--active">Buy credits</a>
                </div>
            </header>

            {/* Hero */}
            <div className="cr-hero">
                <h1 className="cr-hero-title">Simple, pay-as-you-go pricing</h1>
                <p className="cr-hero-sub">
                    Buy credits once, use them whenever. No subscriptions, no monthly commitments.
                </p>
            </div>

            {/* Balance card */}
            <div className="cr-balance-wrap">
                <div className="cr-balance-card">
                    <p className="cr-balance-label">Your current balance</p>
                    <div className="cr-balance-row">
                        <p className="cr-balance-value">{credits.toLocaleString()} credits</p>
                        <div className="cr-balance-bar-track">
                            <div className="cr-balance-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                    <p className="cr-balance-note">≈ {credits.toLocaleString()} product descriptions remaining</p>
                </div>
            </div>

            {/* Toast */}
            {purchased && (
                <div className="cr-toast">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Credits added to your account!
                </div>
            )}

            {/* Plans */}
            <div className="cr-plans-grid">
                {PLANS.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        onBuy={handleBuy}
                        loading={loadingPlan === plan.id}
                    />
                ))}
            </div>

            {/* FAQ */}
            <div className="cr-faq-section">
                <h2 className="cr-faq-heading">Common questions</h2>
                <div className="cr-faq-list">
                    {FAQS.map((faq) => (
                        <FAQRow key={faq.question} {...faq} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreditsPage;