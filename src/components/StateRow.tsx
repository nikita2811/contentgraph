import React from "react";
import type { StatCard } from "../components/types/Dashboard";
import "../css/Stats.css"


interface Props {
    stats: StatCard[];
}

const iconMap = [
    "bolt",
    "description",
    "inventory_2",
    "trending_up",
];



const StatsRow: React.FC<Props> = ({ stats }) => {
    return (
        <div className="dashboard-stats">
            {stats.map((stat, index) => (
                <div key={index} className="dashboard-stat-card">
                    <div className="dashboard-stat-top">
                        <div className="dashboard-stat-icon">
                            <span className="material-symbols-outlined">
                                {iconMap[index % iconMap.length]}
                            </span>
                        </div>


                    </div>

                    <h2 className="dashboard-stat-value">
                        {stat.value}
                    </h2>

                    <h4 className="dashboard-stat-label">
                        {stat.label}
                    </h4>

                    <p className="dashboard-stat-sub">
                        {stat.subLabel}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default StatsRow;