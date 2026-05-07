import React, { useEffect } from "react";
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
        id: "credits", label: "Credits", href: "/credits",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
    },
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    creditsRemaining: number;
    creditsTotal: number;
}

const SidebarDrawer: React.FC<Props> = ({
    isOpen,
    onClose,
    creditsRemaining,
    creditsTotal,
}) => {
    const pct = Math.round((creditsRemaining / creditsTotal) * 100);

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`cg-drawer-overlay ${isOpen ? "cg-drawer-overlay--visible" : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                className={`cg-drawer ${isOpen ? "cg-drawer--open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                {/* Header */}
                <div className="cg-drawer-header">
                    <div className="cg-logo">
                        <div className="dash-brand-logo">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                                <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM11 9v2H9v2h4V9z" />
                            </svg>
                        </div>
                        <span className="cg-logo-content">content</span>
                        <span className="cg-logo-graph">graph</span>
                    </div>
                    <button
                        className="cg-drawer-close"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="cg-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.href}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `cg-nav-item ${isActive ? "cg-nav-item--active" : ""}`
                            }
                        >
                            <span className="cg-nav-icon">{item.icon}</span>
                            <span className="cg-nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Credits widget */}
                <div className="cg-credits-widget">
                    <p className="cg-credits-label">Credits remaining</p>
                    <p className="cg-credits-value">{creditsRemaining}</p>
                    <div className="cg-credits-bar-track">
                        <div className="cg-credits-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <a
                        href="/credits"
                        className="cg-topup-btn"
                        onClick={onClose}
                        style={{ textDecoration: "none", display: "block", textAlign: "center" }}
                    >
                        Top up credits
                    </a>
                </div>
            </aside >
        </>
    );
};

export default SidebarDrawer;