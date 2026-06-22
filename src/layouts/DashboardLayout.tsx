import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import Header from "../components/Header";





const DashboardLayout: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);






    return (
        <div className="dash-shell">
            {/* Header */}
            {/* Top bar with hamburger (mobile only) */}
            <Sidebar
                collapsed={drawerOpen}
                onToggle={() => setDrawerOpen(!drawerOpen)}
                activeHref="/credits"
            />


            <div className="dash-content-col">
                {/* Sidebar */}

                {/* <Sidebar creditsRemaining={50} creditsTotal={170} /> */}
                {/* Drawer — shown on mobile */}
                <Header />


                {/* Page content */}
                <main className="dash-main">
                    <Outlet />
                </main>
            </div>
        </div >
    );
};

export default DashboardLayout;