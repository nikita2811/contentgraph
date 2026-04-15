import React from "react";
import { NavLink } from "react-router-dom";

interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        id: "dashboard", label: "Dashboard", href: "/dashboard",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
    },
    {
        id: "single", label: "Single product", href: "/single-product",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><line x1="7" y1="9" x2="17" y2="9" /><line x1="7" y1="12" x2="13" y2="12" /></svg>,
    },
    {
        id: "bulk", label: "Bulk upload", href: "/bulk-upload",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="3" y1="14" x2="21" y2="14" /><line x1="3" y1="18" x2="15" y2="18" /></svg>,
    },
    {
        id: "history", label: "Job history", href: "/job-history",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" /></svg>,
    },
    {
        id: "api", label: "API keys", href: "/api-keys",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
    },
    {
        id: "credits", label: "Credits", href: "/credits",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
    },
];

interface Props {
    creditsRemaining: number;
    creditsTotal: number;
}

const Sidebar: React.FC<Props> = ({ creditsRemaining, creditsTotal }) => {
    const pct = Math.round((creditsRemaining / creditsTotal) * 100);

    return (
        <aside className="cg-sidebar">
            {/* <div className="dash-brand">
                <div className="dash-brand-logo">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                        <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM11 9v2H9v2h4V9z" />
                    </svg>
                </div>
            </div> */}
            <div className="cg-logo">
                <div className="dash-brand-logo">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                        <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM11 9v2H9v2h4V9z" />
                    </svg>
                </div>
                <span className="cg-logo-content">content</span>
                <span className="cg-logo-graph">graph</span>
            </div>

            <nav className="cg-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.href}
                        className={({ isActive }) =>
                            `cg-nav-item ${isActive ? "cg-nav-item--active" : ""}`
                        }
                    >
                        <span className="cg-nav-icon">{item.icon}</span>
                        <span className="cg-nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="cg-credits-widget">
                <p className="cg-credits-label">Credits remaining</p>
                <p className="cg-credits-value">{creditsRemaining}</p>
                <div className="cg-credits-bar-track">
                    <div className="cg-credits-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <a href="/credits" className="cg-topup-btn" style={{ textDecoration: "none", display: "block", textAlign: "center" }}>Top up credits</a>
            </div>
        </aside>
    );
};

export default Sidebar;