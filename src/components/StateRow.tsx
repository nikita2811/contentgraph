import React from "react";
import type { StatCard } from "../components/types/Dashboard";

interface Props {
    stats: StatCard[];
}

const StatsRow: React.FC<Props> = ({ stats }) => (
    <div className="cg-stats-grid">
        {stats.map((stat, i) => (
            <div key={i} className="cg-stat-card">
                <p className="cg-stat-label">{stat.label}</p>
                <p className="cg-stat-value">{stat.value}</p>
                <p className="cg-stat-sub">{stat.subLabel}</p>
            </div>
        ))}
    </div>
);

export default StatsRow;