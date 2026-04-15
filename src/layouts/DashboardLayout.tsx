import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";




const DashboardLayout: React.FC = () => {


    return (
        <div className="dash-shell">
            {/* Header */}

            <div className="dash-body">
                {/* Sidebar */}

                <Sidebar creditsRemaining={50} creditsTotal={170} />

                {/* Page content */}
                <main className="dash-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;