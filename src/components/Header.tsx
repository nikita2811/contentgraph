import React from "react";

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle sidebar">
                    ☰
                </button>
                <div className="logo">ContentGraph</div>
            </div>

            <nav className="nav">
                <a href="#">Dashboard</a>
                <a href="#">Projects</a>
                <a href="#">Team</a>
                <a href="#">Settings</a>
            </nav>

            <div className="header-right">
                <button className="icon-btn" aria-label="Search">🔍</button>
                <button className="icon-btn" aria-label="Notifications">🔔</button>
                <div className="avatar">JD</div>
            </div>
        </header>
    );
};

export default Header;