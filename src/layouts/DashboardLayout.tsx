import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";





const DashboardLayout: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { setAccessToken } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAccessToken(null);
        navigate("/signin", { replace: true });
    };


    return (
        <div className="dash-shell">
            {/* Header */}
            {/* Top bar with hamburger (mobile only) */}
            <header className="dash-topbar" style={{
                borderBottom: "1px solid var(--your-border-color, #e5e7eb)",
                padding: "0 16px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",  // ✅ make sure this is here
            }}>
                <button
                    className="cg-ham-btn"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open menu"
                    style={{
                        margin: "0 8px 0 0",
                        padding: "8px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        borderRadius: "6px",
                        fontSize: "20px",
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "inherit",

                    }}
                >
                    ☰
                </button>
                {/* Right — logout */}
                <button
                    onClick={handleLogout}
                    aria-label="Log out"
                    style={{
                        padding: "6px 14px",
                        border: "1px solid var(--your-border-color, #e5e7eb)",
                        background: "transparent",
                        cursor: "pointer",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >

                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                </button>
            </header >

            <div className="dash-body">
                {/* Sidebar */}

                {/* <Sidebar creditsRemaining={50} creditsTotal={170} /> */}
                {/* Drawer — shown on mobile */}
                <Sidebar
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    creditsRemaining={50}
                    creditsTotal={170}
                />

                {/* Page content */}
                <main className="dash-main">
                    <Outlet />
                </main>
            </div>
        </div >
    );
};

export default DashboardLayout;